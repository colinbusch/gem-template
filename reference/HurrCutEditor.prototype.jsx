import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Scissors, ChevronDown, ChevronRight, Search, Upload, Film, Music, Image as ImageIcon,
  Type, Square, AlertTriangle, SkipBack, SkipForward, Play, Pause, Magnet, Frame,
  Download, Undo2, Redo2, Copy, Trash2, Plus, Zap, PanelBottom, Moon, Sun, CircleUser,
  Command, Sparkles, Package, HardDrive, RefreshCw, X, ZoomIn, ZoomOut, Check, Loader2,
} from "lucide-react";

/* ============================================================================
   HurrCut — /web editor, rebuilt under the minimal-UI system.
   - Monochrome neutral base + ONE accent (blue), reserved for the primary path
     to outcome = Export (manual §1.9 / §6b).
   - Timeline track colors are the sanctioned data-viz exception (manual §5/§6b),
     applied via inline style (color is signal, not decoration).
   - All spacing uses Tailwind scale steps only (4pt grid, manual §6c). No
     arbitrary off-grid values. Dynamic px positioning (clip left/width, playhead)
     is data-driven layout, not design spacing.
   - States that the old product lacked are first-class here: boot skeleton,
     determinate export progress, empty + error states (manual §4).
   This is the UI layer. Real decode/compositing/export are simulated.
   ========================================================================== */

// ---- Data-viz palette (sanctioned exception; one hue = one meaning) ----
const KIND_COLOR = {
  video: "#58d3ff", image: "#58d3ff", audio: "#86e89f",
  text: "#f2cf67", shape: "#c7a5ff", overlay: "#c7a5ff",
};
const PLAYHEAD = "#ff856f";
const SEMANTIC = { warn: "#f5b13d", error: "#f0606b", ok: "#86e89f" };

// ---- Theme tokens (full coverage in both schemes; fixes old partial light mode) ----
function tokens(dark) {
  return dark
    ? {
        bg0: "bg-zinc-950", bg1: "bg-zinc-900", bg2: "bg-zinc-800/70",
        panel: "bg-zinc-900", text: "text-zinc-100", dim: "text-zinc-400",
        faint: "text-zinc-500", border: "border-zinc-800", borderStrong: "border-zinc-700",
        hover: "hover:bg-zinc-800", input: "bg-zinc-800 border-zinc-700",
        chip: "bg-zinc-800 border-zinc-700", stageBg: "bg-black",
      }
    : {
        bg0: "bg-zinc-100", bg1: "bg-white", bg2: "bg-zinc-100",
        panel: "bg-white", text: "text-zinc-900", dim: "text-zinc-500",
        faint: "text-zinc-400", border: "border-zinc-200", borderStrong: "border-zinc-300",
        hover: "hover:bg-zinc-100", input: "bg-white border-zinc-300",
        chip: "bg-zinc-100 border-zinc-200", stageBg: "bg-zinc-900",
      };
}

// ---- Seed project: a realistic short intro project (no lorem ipsum) ----
const SEED_ASSETS = [
  { id: "a1", name: "intro-hook.mp4", type: "video", duration: 4 },
  { id: "a2", name: "screen-record-01.mp4", type: "video", duration: 9 },
  { id: "a3", name: "bg-music.mp3", type: "audio", duration: 30 },
  { id: "a4", name: "logo-outro.png", type: "image", duration: 3, missing: true },
];
const SEED_TRACKS = [
  { id: "t1", label: "Text", kind: "text" },
  { id: "t2", label: "Overlay", kind: "overlay" },
  { id: "t3", label: "Video", kind: "video" },
  { id: "t4", label: "Audio", kind: "audio" },
];
const mkClip = (o) => ({
  x: 0, y: 0, scale: 100, rotate: 0, opacity: 100,
  volume: 100, muted: false, brightness: 100, contrast: 100, saturate: 100, blur: 0,
  fadeIn: 0, fadeOut: 0, text: "", fontSize: 64, ...o,
});
const SEED_CLIPS = [
  mkClip({ id: "c1", kind: "video", trackId: "t3", assetId: "a1", name: "intro-hook.mp4", start: 0, dur: 4 }),
  mkClip({ id: "c2", kind: "video", trackId: "t3", assetId: "a2", name: "screen-record-01.mp4", start: 4, dur: 9 }),
  mkClip({ id: "c6", kind: "video", trackId: "t3", assetId: "a4", name: "logo-outro.png", start: 13, dur: 3 }),
  mkClip({ id: "c3", kind: "text", trackId: "t1", name: "Welcome to HurrCut", text: "Welcome to HurrCut", start: 1, dur: 3, fontSize: 72 }),
  mkClip({ id: "c4", kind: "shape", trackId: "t2", name: "Lower third", start: 4, dur: 4, opacity: 90 }),
  mkClip({ id: "c5", kind: "audio", trackId: "t4", assetId: "a3", name: "bg-music.mp3", start: 0, dur: 13, volume: 55 }),
];

const RES_PRESETS = [
  { label: "1920×1080", w: 1920, h: 1080 },
  { label: "1080×1920", w: 1080, h: 1920 },
  { label: "1080×1080", w: 1080, h: 1080 },
  { label: "1280×720", w: 1280, h: 720 },
];
const AI_JOBS = [
  { id: "caption-cleanup", label: "Caption cleanup", cr: 5 },
  { id: "rough-cut-plan", label: "Rough-cut plan", cr: 12 },
  { id: "publish-package", label: "Publish package", cr: 10 },
  { id: "broll-search-prompts", label: "B-roll search prompts", cr: 5 },
  { id: "attribution-summary", label: "Attribution summary", cr: 4 },
  { id: "project-assistant", label: "Project assistant", cr: 6 },
];

const fmt = (s) => {
  s = Math.max(0, s);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const cs = Math.floor((s * 100) % 100);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
};
const KIND_ICON = { video: Film, image: ImageIcon, audio: Music, text: Type, shape: Square, overlay: Square };

export default function HurrCutEditor() {
  const [dark, setDark] = useState(true);
  const t = tokens(dark);

  const [booting, setBooting] = useState(true);
  useEffect(() => { const id = setTimeout(() => setBooting(false), 700); return () => clearTimeout(id); }, []);

  const [assets, setAssets] = useState(SEED_ASSETS);
  const [tracks] = useState(SEED_TRACKS);
  const [clips, setClips] = useState(SEED_CLIPS);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedId, setSelectedId] = useState("c3");

  const [zoom, setZoom] = useState(64); // px / second
  const [snap, setSnap] = useState(true);
  const [guides, setGuides] = useState(true);
  const [playhead, setPlayhead] = useState(1.2);
  const [playing, setPlaying] = useState(false);

  const [packsOpen, setPacksOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [exportState, setExportState] = useState({ status: "idle", progress: 0 });
  const [credits] = useState(8);
  const [ai, setAi] = useState({ job: "caption-cleanup", notes: "", status: "idle", result: "" });

  const duration = useMemo(
    () => clips.reduce((m, c) => Math.max(m, c.start + c.dur), 0) || 1,
    [clips]
  );
  const selected = clips.find((c) => c.id === selectedId) || null;
  const missingOnTimeline = clips.filter((c) => assets.find((a) => a.id === c.assetId && a.missing));

  // ---------- history ----------
  const pushHistory = useCallback(() => {
    setHistory((h) => [...h, clips].slice(-80));
    setFuture([]);
  }, [clips]);
  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      setFuture((f) => [clips, ...f].slice(0, 80));
      setClips(h[h.length - 1]);
      return h.slice(0, -1);
    });
  }, [clips]);
  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      setHistory((h) => [...h, clips].slice(-80));
      setClips(f[0]);
      return f.slice(1);
    });
  }, [clips]);

  const patchSelected = (patch) =>
    setClips((cs) => cs.map((c) => (c.id === selectedId ? { ...c, ...patch } : c)));

  const toast = (msg, action) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { id, msg, action }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4500);
  };

  // ---------- playback ----------
  const raf = useRef(0); const last = useRef(0);
  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now) => {
      const dt = (now - last.current) / 1000; last.current = now;
      setPlayhead((p) => { const n = p + dt; if (n >= duration) { setPlaying(false); return duration; } return n; });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, duration]);

  // ---------- structural ops ----------
  const deleteSelected = () => {
    if (!selected) return;
    pushHistory();
    setClips((cs) => cs.filter((c) => c.id !== selectedId));
    setSelectedId(null);
    toast("Clip deleted", { label: "Undo", run: undo });
  };
  const duplicateSelected = () => {
    if (!selected) return;
    pushHistory();
    const nid = "c" + Math.random().toString(36).slice(2, 6);
    setClips((cs) => [...cs, { ...selected, id: nid, start: selected.start + selected.dur }]);
    setSelectedId(nid);
  };
  const splitAtPlayhead = () => {
    if (!selected) return;
    if (playhead <= selected.start || playhead >= selected.start + selected.dur) {
      toast("Playhead is not over the selected clip"); return;
    }
    pushHistory();
    const left = playhead - selected.start;
    const nid = "c" + Math.random().toString(36).slice(2, 6);
    setClips((cs) =>
      cs.flatMap((c) =>
        c.id === selectedId
          ? [{ ...c, dur: left }, { ...c, id: nid, start: playhead, dur: c.dur - left }]
          : [c]
      )
    );
  };
  const addClip = (kind) => {
    pushHistory();
    const trk = tracks.find((x) => x.kind === kind) || tracks.find((x) => x.kind === "overlay");
    const nid = "c" + Math.random().toString(36).slice(2, 6);
    const labels = { text: "New text", shape: "Shape", hook: "Hook", lowerthird: "Lower third" };
    setClips((cs) => [
      ...cs,
      mkClip({ id: nid, kind: kind === "hook" || kind === "lowerthird" ? "shape" : kind, trackId: trk.id,
        name: labels[kind] || "New clip", text: kind === "text" ? "New text" : "", start: Math.round(playhead), dur: 3 }),
    ]);
    setSelectedId(nid);
    toast(`Added ${labels[kind] || kind}`);
  };

  // ---------- export (determinate progress; blocked by missing media) ----------
  const runExport = () => {
    if (missingOnTimeline.length) { setExportState({ status: "error", progress: 0 }); return; }
    setExportState({ status: "exporting", progress: 0 });
    const iv = setInterval(() => {
      setExportState((e) => {
        if (e.status !== "exporting") { clearInterval(iv); return e; }
        const p = Math.min(100, e.progress + 7);
        if (p >= 100) { clearInterval(iv); toast("Export complete — onboarding-tour-v2.webm", { label: "Download", run: () => {} }); return { status: "done", progress: 100 }; }
        return { status: "exporting", progress: p };
      });
    }, 130);
  };
  const relinkMissing = () => {
    pushHistory();
    setAssets((as) => as.map((a) => (a.missing ? { ...a, missing: false } : a)));
    setExportState({ status: "idle", progress: 0 });
    toast("Relinked logo-outro.png");
  };

  // ---------- AI job ----------
  const runAi = () => {
    const job = AI_JOBS.find((j) => j.id === ai.job);
    if (job.cr > credits) { setAi((s) => ({ ...s, status: "nocredits", result: "" })); return; }
    setAi((s) => ({ ...s, status: "running", result: "" }));
    setTimeout(() => {
      const sample = {
        "caption-cleanup": "✓ 14 captions normalized\n• Removed 6 filler words (\"um\", \"like\")\n• Fixed 3 timing overlaps\n• Sentence-cased 14 lines",
        "broll-search-prompts": "1. close-up hands typing on laptop, soft window light\n2. screen UI macro, shallow depth of field\n3. coffee shop ambient, slow pan",
        "attribution-summary": "bg-music.mp3 — \"Particles\" by Kevin MacLeod, CC BY 4.0\nWritten to attributions.md on export.",
      }[ai.job] || "Plan ready. Review suggested cuts in the timeline.";
      setAi((s) => ({ ...s, status: "done", result: sample }));
    }, 1100);
  };

  // ---------- keyboard ----------
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea";
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen((v) => !v); return; }
      if (typing) return;
      if (e.code === "Space") { e.preventDefault(); setPlaying((p) => !p); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); }
      else if (e.key === "Delete" || e.key === "Backspace") { if (selected) { e.preventDefault(); deleteSelected(); } }
      else if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const PALETTE_ACTIONS = [
    { label: "Import media", run: () => toast("Choose files…"), icon: Upload },
    { label: "Add text", run: () => addClip("text"), icon: Type },
    { label: "Add shape", run: () => addClip("shape"), icon: Square },
    { label: "Split clip at playhead", run: splitAtPlayhead, icon: Scissors },
    { label: "Duplicate clip", run: duplicateSelected, icon: Copy },
    { label: "Delete clip", run: deleteSelected, icon: Trash2 },
    { label: "Toggle snapping", run: () => setSnap((s) => !s), icon: Magnet },
    { label: "Export WebM", run: runExport, icon: Download },
    { label: dark ? "Switch to light theme" : "Switch to dark theme", run: () => setDark((d) => !d), icon: dark ? Sun : Moon },
  ];

  if (booting) return <BootSkeleton t={t} />;

  return (
    <div className={`w-full h-screen ${t.bg0} ${t.text} flex flex-col text-sm antialiased select-none`} style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      {/* ===== Row 1: MenuBar (48px) ===== */}
      <header className={`h-12 shrink-0 ${t.panel} border-b ${t.border} flex items-center gap-1 px-2`}>
        <div className="flex items-center gap-2 pr-2">
          <div className="h-7 w-7 rounded-md grid place-items-center" style={{ background: KIND_COLOR.video, color: "#06121a" }}>
            <Scissors size={15} strokeWidth={2.5} />
          </div>
          <span className="font-semibold tracking-tight">HurrCut</span>
        </div>
        <nav className="flex items-center">
          {["File", "Edit", "Project"].map((m) => (
            <button key={m} className={`h-8 px-2.5 rounded-md ${t.dim} ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>{m}</button>
          ))}
        </nav>
        <div className="flex-1 grid place-items-center">
          <div className={`h-8 px-3 rounded-md border ${t.border} flex items-center gap-2 ${t.dim}`}>
            <span className={t.text}>Onboarding Tour v2</span>
            <span className={`${t.faint} flex items-center gap-1`}><Check size={12} style={{ color: SEMANTIC.ok }} /> saved</span>
          </div>
        </div>
        <button onClick={() => setPaletteOpen(true)} className={`h-8 px-2.5 rounded-md border ${t.border} ${t.dim} ${t.hover} flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
          <Command size={13} /> <span className="text-xs">K</span>
        </button>
        <button aria-label="Toggle theme" onClick={() => setDark((d) => !d)} className={`h-8 w-8 grid place-items-center rounded-md ${t.dim} ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button aria-label="Account" className={`h-8 w-8 grid place-items-center rounded-md ${t.dim} ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
          <CircleUser size={18} />
        </button>
      </header>

      {/* ===== Row 2: WorkspaceBar (36px, quieted) ===== */}
      <div className={`h-9 shrink-0 ${t.bg1} border-b ${t.border} flex items-center justify-between px-3 ${t.faint} text-xs`}>
        <div className="flex items-center gap-2"><HardDrive size={13} /> Workspace <span className={t.dim}>Local · OPFS</span></div>
        <div className="flex items-center gap-2"><RefreshCw size={13} /> Folder sync <span className={t.dim}>~/Tutorials/.hurrcut</span> <span style={{ color: SEMANTIC.ok }}>in sync</span></div>
      </div>

      {/* ===== Row 3: 3-column workspace ===== */}
      <div className="flex-1 min-h-0 flex">
        {/* MediaBin */}
        <aside className={`w-64 shrink-0 ${t.panel} border-r ${t.border} flex flex-col min-h-0`}>
          <div className={`h-9 px-3 flex items-center justify-between border-b ${t.border}`}>
            <span className="font-medium">Media</span>
            <button className={`h-7 px-2 rounded-md ${t.chip} border ${t.hover} flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
              <Upload size={13} /> Import
            </button>
          </div>
          <div className={`p-2 border-b ${t.border}`}>
            <div className={`h-8 px-2 rounded-md border ${t.input} flex items-center gap-2`}>
              <Search size={13} className={t.faint} />
              <input placeholder="Search media" className="bg-transparent outline-none w-full placeholder:text-zinc-500" />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {assets.length === 0 ? (
              <EmptyState t={t} icon={Upload} title="No media yet" body="Drop files here or import to begin." />
            ) : assets.map((a) => {
              const Icon = KIND_ICON[a.type] || Film;
              return (
                <div key={a.id} className={`group flex items-center gap-2 p-1.5 rounded-md ${t.hover} cursor-grab`}>
                  <div className="h-10 w-16 rounded shrink-0 grid place-items-center" style={{ background: a.missing ? "transparent" : dark ? "#0c1620" : "#e9eef3", border: a.missing ? `1px dashed ${SEMANTIC.error}` : "none", color: KIND_COLOR[a.type] }}>
                    {a.missing ? <AlertTriangle size={15} style={{ color: SEMANTIC.error }} /> : <Icon size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate ${a.missing ? "" : t.text}`} style={a.missing ? { color: SEMANTIC.error } : undefined}>{a.name}</div>
                    <div className={`text-xs ${t.faint}`}>{a.missing ? "missing — relink" : `${a.type} · ${fmt(a.duration)}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`m-2 mt-0 rounded-md border border-dashed ${t.borderStrong} ${t.faint} text-xs grid place-items-center py-3`}>
            Drag files here to import
          </div>
        </aside>

        {/* Stage */}
        <main className={`flex-1 min-w-0 ${t.bg0} flex flex-col`}>
          <div className="flex-1 min-h-0 grid place-items-center p-6">
            <Preview t={t} clips={clips} assets={assets} playhead={playhead} guides={guides} dark={dark} />
          </div>
          {/* transport (under preview — convention; Jakob §1.4) */}
          <div className={`h-12 shrink-0 ${t.panel} border-t ${t.border} flex items-center gap-2 px-3`}>
            <IconBtn t={t} label="Back" onClick={() => setPlayhead(0)}><SkipBack size={16} /></IconBtn>
            <button aria-label={playing ? "Pause" : "Play"} onClick={() => setPlaying((p) => !p)}
              className={`h-9 w-9 grid place-items-center rounded-full ${dark ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900 text-zinc-100"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
              {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <IconBtn t={t} label="Forward" onClick={() => setPlayhead(duration)}><SkipForward size={16} /></IconBtn>
            <div className="px-2 tabular-nums">
              <span className={t.text}>{fmt(playhead)}</span>
              <span className={t.faint}> / {fmt(duration)}</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <IconBtn t={t} label="Zoom out" onClick={() => setZoom((z) => Math.max(28, z - 16))}><ZoomOut size={15} /></IconBtn>
              <IconBtn t={t} label="Zoom in" onClick={() => setZoom((z) => Math.min(180, z + 16))}><ZoomIn size={15} /></IconBtn>
              <Toggle t={t} on={snap} onClick={() => setSnap((s) => !s)} icon={Magnet} label="Snap" />
              <Toggle t={t} on={guides} onClick={() => setGuides((g) => !g)} icon={Frame} label="Guides" />
            </div>
          </div>
        </main>

        {/* Right rail */}
        <aside className={`w-72 shrink-0 ${t.panel} border-l ${t.border} flex flex-col min-h-0`}>
          <div className="flex-1 overflow-auto">
            {/* Inspector */}
            <SectionHead t={t} label="Inspector" />
            {!selected ? (
              <div className="px-3 pb-3">
                <EmptyState t={t} icon={Square} title="Nothing selected" body="Select a clip on the timeline to edit its properties." />
              </div>
            ) : (
              <div className="px-3 pb-3 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[selected.kind] }} />
                  <span className="font-medium truncate">{selected.name}</span>
                  <span className={`ml-auto text-xs ${t.faint}`}>{selected.kind}</span>
                </div>
                {selected.kind === "text" && (
                  <Group t={t} title="Text" defaultOpen>
                    <textarea value={selected.text} onChange={(e) => patchSelected({ text: e.target.value })} onMouseDown={pushHistory}
                      className={`w-full h-16 rounded-md p-2 border ${t.input} outline-none resize-none focus-visible:ring-2 focus-visible:ring-blue-500`} />
                    <Slider t={t} label="Size" value={selected.fontSize} min={16} max={160} onStart={pushHistory} onChange={(v) => patchSelected({ fontSize: v })} suffix="px" />
                  </Group>
                )}
                <Group t={t} title="Transform" defaultOpen>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberField t={t} label="X" value={selected.x} onStart={pushHistory} onChange={(v) => patchSelected({ x: v })} />
                    <NumberField t={t} label="Y" value={selected.y} onStart={pushHistory} onChange={(v) => patchSelected({ y: v })} />
                  </div>
                  <Slider t={t} label="Scale" value={selected.scale} min={10} max={300} onStart={pushHistory} onChange={(v) => patchSelected({ scale: v })} suffix="%" />
                  <Slider t={t} label="Rotation" value={selected.rotate} min={-180} max={180} onStart={pushHistory} onChange={(v) => patchSelected({ rotate: v })} suffix="°" />
                  <Slider t={t} label="Opacity" value={selected.opacity} min={0} max={100} onStart={pushHistory} onChange={(v) => patchSelected({ opacity: v })} suffix="%" />
                </Group>
                {selected.kind !== "audio" && (
                  <Group t={t} title="Effects">
                    <Slider t={t} label="Brightness" value={selected.brightness} min={0} max={200} onStart={pushHistory} onChange={(v) => patchSelected({ brightness: v })} suffix="%" />
                    <Slider t={t} label="Contrast" value={selected.contrast} min={0} max={200} onStart={pushHistory} onChange={(v) => patchSelected({ contrast: v })} suffix="%" />
                    <Slider t={t} label="Saturation" value={selected.saturate} min={0} max={200} onStart={pushHistory} onChange={(v) => patchSelected({ saturate: v })} suffix="%" />
                    <Slider t={t} label="Blur" value={selected.blur} min={0} max={20} onStart={pushHistory} onChange={(v) => patchSelected({ blur: v })} suffix="px" />
                  </Group>
                )}
                {(selected.kind === "audio" || selected.kind === "video") && (
                  <Group t={t} title="Audio">
                    <Slider t={t} label="Volume" value={selected.volume} min={0} max={100} onStart={pushHistory} onChange={(v) => patchSelected({ volume: v })} suffix="%" />
                  </Group>
                )}
              </div>
            )}

            {/* CreatorPacks */}
            <Collapsible t={t} title="Creator packs" icon={Package} open={packsOpen} setOpen={setPacksOpen}>
              <div className="space-y-1">
                {["Clean titles", "Subscribe hooks", "Lower thirds"].map((p) => (
                  <div key={p} className={`flex items-center gap-2 p-1.5 rounded-md ${t.hover}`}>
                    <div className="h-8 w-12 rounded grid place-items-center" style={{ background: KIND_COLOR.shape, color: "#1c1430" }}><PanelBottom size={14} /></div>
                    <span className="flex-1 truncate">{p}</span>
                    <button onClick={() => addClip("lowerthird")} className={`h-7 px-2 rounded-md ${t.chip} border ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>Insert</button>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* AiAssistant */}
            <Collapsible t={t} title="AI assistant" icon={Sparkles} open={aiOpen} setOpen={setAiOpen}>
              <div className="space-y-2">
                <select value={ai.job} onChange={(e) => setAi((s) => ({ ...s, job: e.target.value, status: "idle", result: "" }))}
                  className={`w-full h-8 rounded-md px-2 border ${t.input} outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
                  {AI_JOBS.map((j) => <option key={j.id} value={j.id}>{j.label} · {j.cr} cr</option>)}
                </select>
                <textarea value={ai.notes} onChange={(e) => setAi((s) => ({ ...s, notes: e.target.value }))} placeholder="Notes for the job (optional)"
                  className={`w-full h-14 rounded-md p-2 border ${t.input} outline-none resize-none placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-blue-500`} />
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${t.faint}`}>{credits} credits left</span>
                  <button onClick={runAi} disabled={ai.status === "running"}
                    className={`h-8 px-3 rounded-md ${t.chip} border ${t.hover} flex items-center gap-1.5 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
                    {ai.status === "running" ? <><Loader2 size={13} className="animate-spin" /> Running</> : <><Sparkles size={13} /> Run</>}
                  </button>
                </div>
                {ai.status === "nocredits" && (
                  <div className="rounded-md p-2 text-xs" style={{ background: dark ? "#2a1d14" : "#fdf2e3", color: SEMANTIC.warn, border: `1px solid ${SEMANTIC.warn}55` }}>
                    Not enough credits for this job. Free tier includes {credits}. Lower-cost jobs (caption cleanup, attribution summary) are available.
                  </div>
                )}
                {ai.result && (
                  <pre className={`rounded-md p-2 text-xs whitespace-pre-wrap ${t.bg2} ${t.dim} border ${t.border}`}>{ai.result}</pre>
                )}
              </div>
            </Collapsible>
          </div>

          {/* StatusRail */}
          <div className={`shrink-0 border-t ${t.border} p-2 space-y-2`}>
            <div className="flex items-center gap-1.5">
              {[["effects", false], ["timeline", false], ["export", exportState.status === "exporting"]].map(([name, busy]) => (
                <span key={name} className={`flex-1 h-6 rounded-md border ${t.border} ${t.bg2} flex items-center justify-center gap-1.5 text-xs ${t.dim}`}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: busy ? SEMANTIC.warn : dark ? "#3f3f46" : "#d4d4d8" }} />{name}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={t.faint}>Export</span>
              <span className={t.dim}>{exportState.status === "exporting" ? `${exportState.progress}%` : exportState.status === "done" ? "ready" : "idle"}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={t.faint}>Tier</span>
              <span className={t.dim}>Free</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== Row 4: CommandBar (56px) ===== */}
      <div className={`h-14 shrink-0 ${t.panel} border-t ${t.border} flex items-center gap-3 px-3 overflow-x-auto`}>
        <BarGroup t={t} label="Add">
          <BarBtn t={t} icon={Upload} onClick={() => toast("Choose files…")}>Import</BarBtn>
          <BarBtn t={t} icon={Type} onClick={() => addClip("text")}>Text</BarBtn>
          <BarBtn t={t} icon={Square} onClick={() => addClip("shape")}>Shape</BarBtn>
          <BarBtn t={t} icon={Zap} onClick={() => addClip("hook")}>Hook</BarBtn>
          <BarBtn t={t} icon={PanelBottom} onClick={() => addClip("lowerthird")}>Lower-third</BarBtn>
        </BarGroup>
        <Divider t={t} />
        <BarGroup t={t} label="Edit">
          <BarBtn t={t} icon={Undo2} onClick={undo} disabled={!history.length}>Undo</BarBtn>
          <BarBtn t={t} icon={Redo2} onClick={redo} disabled={!future.length}>Redo</BarBtn>
          <BarBtn t={t} icon={Scissors} onClick={splitAtPlayhead} disabled={!selected}>Split</BarBtn>
          <BarBtn t={t} icon={Copy} onClick={duplicateSelected} disabled={!selected}>Duplicate</BarBtn>
          <BarBtn t={t} icon={Trash2} onClick={deleteSelected} disabled={!selected}>Delete</BarBtn>
        </BarGroup>
        <div className="flex-1" />
        {/* Tail — Export is the single accent (primary path to outcome) */}
        <button onClick={runExport} disabled={exportState.status === "exporting"}
          className="h-9 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
          {exportState.status === "exporting" ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          {exportState.status === "exporting" ? `Exporting ${exportState.progress}%` : "Export WebM"}
        </button>
      </div>

      {/* Export progress / error (fixes old: no progress bar, silent failures) */}
      {exportState.status === "exporting" && (
        <div className={`h-1 ${t.bg2}`}><div className="h-full bg-blue-600 transition-all" style={{ width: `${exportState.progress}%` }} /></div>
      )}
      {exportState.status === "error" && (
        <div className="px-3 py-2 flex items-center gap-3 text-xs" style={{ background: dark ? "#2a1416" : "#fdeaec", color: SEMANTIC.error, borderTop: `1px solid ${SEMANTIC.error}55` }}>
          <AlertTriangle size={15} />
          <span className="flex-1">Can’t export — {missingOnTimeline.length} media file{missingOnTimeline.length > 1 ? "s are" : " is"} missing ({missingOnTimeline.map((c) => c.name).join(", ")}). Relink or remove to continue.</span>
          <button onClick={relinkMissing} className="h-7 px-2 rounded-md font-medium" style={{ background: SEMANTIC.error, color: "#fff" }}>Relink</button>
          <button onClick={() => { setSelectedId(missingOnTimeline[0].id); deleteSelected(); setExportState({ status: "idle", progress: 0 }); }} className={`h-7 px-2 rounded-md border ${t.borderStrong}`}>Remove</button>
        </div>
      )}

      {/* ===== Row 5: Timeline ===== */}
      <Timeline
        t={t} tracks={tracks} clips={clips} setClips={setClips} duration={duration} zoom={zoom}
        snap={snap} playhead={playhead} setPlayhead={setPlayhead} selectedId={selectedId}
        setSelectedId={setSelectedId} pushHistory={pushHistory} dark={dark}
      />

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 space-y-2 z-40">
        {toasts.map((to) => (
          <div key={to.id} className={`${dark ? "bg-zinc-800" : "bg-zinc-900"} text-zinc-100 rounded-md px-3 h-10 flex items-center gap-3 shadow-lg`}>
            <span className="text-xs">{to.msg}</span>
            {to.action && <button onClick={() => { to.action.run(); setToasts((ts) => ts.filter((x) => x.id !== to.id)); }} className="text-xs font-medium text-blue-400">{to.action.label}</button>}
          </div>
        ))}
      </div>

      {/* Command palette (⌘K — power-user escape hatch, manual §5) */}
      {paletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24" onClick={() => setPaletteOpen(false)}>
          <Palette t={t} actions={PALETTE_ACTIONS} onClose={() => setPaletteOpen(false)} dark={dark} />
        </div>
      )}
    </div>
  );
}

/* ---------------- sub-components ---------------- */

function BootSkeleton({ t }) {
  return (
    <div className={`w-full h-screen ${t.bg0} flex flex-col`}>
      <div className={`h-12 ${t.panel} border-b ${t.border} flex items-center px-3 gap-3`}>
        <div className="h-7 w-7 rounded-md bg-zinc-700 animate-pulse" />
        <div className="h-4 w-24 rounded bg-zinc-700 animate-pulse" />
      </div>
      <div className="flex-1 flex">
        <div className={`w-64 border-r ${t.border} p-3 space-y-2`}>{[0, 1, 2, 3].map((i) => <div key={i} className="h-12 rounded bg-zinc-800 animate-pulse" />)}</div>
        <div className="flex-1 grid place-items-center"><div className="w-2/3 aspect-video rounded bg-zinc-800 animate-pulse" /></div>
        <div className={`w-72 border-l ${t.border} p-3 space-y-2`}>{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-8 rounded bg-zinc-800 animate-pulse" />)}</div>
      </div>
      <div className={`h-40 border-t ${t.border} p-3 space-y-2`}>{[0, 1, 2].map((i) => <div key={i} className="h-8 rounded bg-zinc-800 animate-pulse" />)}</div>
    </div>
  );
}

function Preview({ t, clips, assets, playhead, guides, dark }) {
  const active = clips.filter((c) => playhead >= c.start && playhead < c.start + c.dur && c.kind !== "audio");
  // top track renders last (on top): order by track t1(top)->t3
  const order = { t1: 3, t2: 2, t3: 1, t4: 0 };
  active.sort((a, b) => (order[a.trackId] || 0) - (order[b.trackId] || 0));
  return (
    <div className={`relative ${t.stageBg} rounded-lg overflow-hidden`} style={{ width: "min(100%, 720px)", aspectRatio: "16 / 9", boxShadow: dark ? "0 1px 0 rgba(255,255,255,0.04)" : "0 1px 3px rgba(0,0,0,0.12)" }}>
      {active.length === 0 && (
        <div className="absolute inset-0 grid place-items-center text-zinc-500 text-xs">Add media to the timeline to preview</div>
      )}
      {active.map((c) => {
        const filt = `brightness(${c.brightness}%) contrast(${c.contrast}%) saturate(${c.saturate}%) blur(${c.blur}px)`;
        const transform = `translate(-50%,-50%) translate(${c.x}px, ${c.y}px) scale(${c.scale / 100}) rotate(${c.rotate}deg)`;
        const common = { position: "absolute", left: "50%", top: "50%", transform, opacity: c.opacity / 100, filter: filt };
        const asset = assets.find((a) => a.id === c.assetId);
        if (c.kind === "text") return <div key={c.id} style={{ ...common, color: "#fff", fontWeight: 800, fontSize: c.fontSize * 0.42, textShadow: "0 2px 12px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>{c.text}</div>;
        if (c.kind === "shape") return <div key={c.id} style={{ ...common, width: "70%", height: 56, borderRadius: 8, background: "linear-gradient(90deg, rgba(199,165,255,.0), rgba(199,165,255,.85))" }} />;
        // video/image placeholder frame
        return (
          <div key={c.id} style={{ ...common, width: "78%", height: "78%", borderRadius: 6, background: dark ? "#0c1620" : "#1a2733", border: `1px solid ${KIND_COLOR.video}55`, display: "grid", placeItems: "center", color: KIND_COLOR.video }}>
            <div className="text-center">
              <Film size={22} />
              <div className="text-xs mt-1" style={{ color: "#9fb3c2" }}>{asset?.name || c.name}</div>
            </div>
          </div>
        );
      })}
      {guides && (
        <div className="absolute inset-0 pointer-events-none" style={{ outline: "1px dashed rgba(255,255,255,0.18)", outlineOffset: "-8%" }} />
      )}
    </div>
  );
}

function Timeline({ t, tracks, clips, setClips, duration, zoom, snap, playhead, setPlayhead, selectedId, setSelectedId, pushHistory, dark }) {
  const scrollRef = useRef(null);
  const drag = useRef(null);
  const width = Math.max(duration, 8) * zoom + 80;

  const onClipDown = (e, clip, mode) => {
    e.stopPropagation();
    setSelectedId(clip.id);
    pushHistory();
    drag.current = { id: clip.id, mode, startX: e.clientX, origStart: clip.start, origDur: clip.dur };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const dx = (e.clientX - d.startX) / zoom;
    const snapTo = (v) => (snap ? Math.round(v * 4) / 4 : v);
    setClips((cs) => cs.map((c) => {
      if (c.id !== d.id) return c;
      if (d.mode === "move") return { ...c, start: Math.max(0, snapTo(d.origStart + dx)) };
      if (d.mode === "right") return { ...c, dur: Math.max(0.25, snapTo(d.origDur + dx)) };
      if (d.mode === "left") { const ns = Math.max(0, snapTo(d.origStart + dx)); const delta = ns - d.origStart; return { ...c, start: ns, dur: Math.max(0.25, d.origDur - delta) }; }
      return c;
    }));
  };
  const onUp = () => { drag.current = null; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };

  const scrubDown = (e) => {
    const rect = scrollRef.current.getBoundingClientRect();
    const move = (ev) => { const x = ev.clientX - rect.left + scrollRef.current.scrollLeft - 80; setPlayhead(Math.max(0, x / zoom)); };
    move(e);
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };

  const ticks = []; for (let s = 0; s <= duration + 1; s++) ticks.push(s);

  return (
    <div className={`h-56 shrink-0 ${t.panel} border-t ${t.border} flex flex-col`}>
      <div ref={scrollRef} className="flex-1 overflow-auto relative">
        <div style={{ width }}>
          {/* ruler */}
          <div className={`h-7 sticky top-0 ${t.bg1} border-b ${t.border} z-10 cursor-ew-resize`} onPointerDown={scrubDown}>
            <div className="relative h-full" style={{ marginLeft: 80 }}>
              {ticks.map((s) => (
                <div key={s} className={`absolute top-0 h-full text-xs tabular-nums ${t.faint} border-l ${t.border} pl-1`} style={{ left: s * zoom }}>{s}s</div>
              ))}
            </div>
          </div>
          {/* lanes */}
          {tracks.map((trk) => (
            <div key={trk.id} className={`h-12 border-b ${t.border} relative flex`}>
              <div className={`w-20 shrink-0 ${t.bg1} border-r ${t.border} flex items-center gap-1.5 px-2 text-xs ${t.dim} sticky left-0 z-10`}>
                <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[trk.kind] }} />{trk.label}
              </div>
              <div className="relative flex-1">
                {clips.filter((c) => c.trackId === trk.id).map((c) => {
                  const sel = c.id === selectedId;
                  const col = KIND_COLOR[c.kind];
                  const missing = c.name.includes("logo-outro");
                  return (
                    <div key={c.id} onPointerDown={(e) => onClipDown(e, c, "move")}
                      className={`absolute top-1 bottom-1 rounded-md overflow-hidden cursor-grab ${sel ? "ring-2" : ""}`}
                      style={{ left: c.start * zoom, width: Math.max(8, c.dur * zoom), background: dark ? `${col}26` : `${col}33`, border: `1px solid ${col}`, boxShadow: sel ? `0 0 0 2px ${col}` : "none" }}>
                      <div className="h-full flex items-center px-2 gap-1 text-xs" style={{ color: dark ? "#e6edf3" : "#1b2733" }}>
                        {missing && <AlertTriangle size={11} style={{ color: SEMANTIC.error }} />}
                        <span className="truncate">{c.name}</span>
                      </div>
                      {/* trim handles */}
                      <div onPointerDown={(e) => onClipDown(e, c, "left")} className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize" style={{ background: `${col}` }} />
                      <div onPointerDown={(e) => onClipDown(e, c, "right")} className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize" style={{ background: `${col}` }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {/* playhead */}
          <div className="absolute top-0 bottom-0 pointer-events-none z-20" style={{ left: 80 + playhead * zoom, width: 2, background: PLAYHEAD }}>
            <div className="absolute -top-0 -left-1 w-0 h-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${PLAYHEAD}` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Palette({ t, actions, onClose, dark }) {
  const [q, setQ] = useState("");
  const filtered = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-lg mx-4 ${t.panel} border ${t.borderStrong} rounded-lg overflow-hidden shadow-2xl`}>
      <div className={`flex items-center gap-2 px-3 h-11 border-b ${t.border}`}>
        <Command size={15} className={t.faint} />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command…" className="flex-1 bg-transparent outline-none placeholder:text-zinc-500" />
        <button onClick={onClose} className={`${t.faint} ${t.hover} rounded p-1`}><X size={14} /></button>
      </div>
      <div className="max-h-72 overflow-auto p-1">
        {filtered.length === 0 && <div className={`px-3 py-6 text-center text-xs ${t.faint}`}>No matching commands</div>}
        {filtered.map((a) => (
          <button key={a.label} onClick={() => { a.run(); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-md ${t.hover} text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
            <a.icon size={15} className={t.dim} /> <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const IconBtn = ({ t, label, onClick, children }) => (
  <button aria-label={label} onClick={onClick} className={`h-8 w-8 grid place-items-center rounded-md ${t.dim} ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>{children}</button>
);
const Toggle = ({ t, on, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`h-8 px-2 rounded-md flex items-center gap-1.5 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${on ? "border-blue-500 text-blue-500" : `${t.border} ${t.dim} ${t.hover}`}`}>
    <Icon size={14} /> <span className="text-xs">{label}</span>
  </button>
);
const BarGroup = ({ t, label, children }) => (
  <div className="flex flex-col items-start shrink-0">
    <span className={`text-xs uppercase tracking-wide ${t.faint} mb-0.5 pl-1`}>{label}</span>
    <div className="flex items-center gap-1">{children}</div>
  </div>
);
const BarBtn = ({ t, icon: Icon, onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className={`h-8 px-2 rounded-md flex items-center gap-1.5 ${t.dim} ${t.hover} disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
    <Icon size={14} /> <span className="text-xs">{children}</span>
  </button>
);
const Divider = ({ t }) => <div className={`w-px h-8 ${t.border} border-l`} />;
const SectionHead = ({ t, label }) => (
  <div className={`h-9 px-3 flex items-center text-xs uppercase tracking-wide ${t.faint} border-b ${t.border}`}>{label}</div>
);
const EmptyState = ({ t, icon: Icon, title, body }) => (
  <div className={`rounded-md border border-dashed ${t.borderStrong} py-5 px-3 text-center`}>
    <Icon size={18} className={`mx-auto ${t.faint}`} />
    <div className={`mt-1.5 text-sm ${t.dim}`}>{title}</div>
    <div className={`text-xs ${t.faint} mt-0.5`}>{body}</div>
  </div>
);

function Group({ t, title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`rounded-md border ${t.border}`}>
      <button onClick={() => setOpen((o) => !o)} className={`w-full h-8 px-2 flex items-center gap-1.5 text-xs font-medium ${t.dim} ${t.hover} rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />} {title}
      </button>
      {open && <div className="p-2 pt-1 space-y-2">{children}</div>}
    </div>
  );
}
function Collapsible({ t, title, icon: Icon, open, setOpen, children }) {
  return (
    <div className={`border-t ${t.border}`}>
      <button onClick={() => setOpen((o) => !o)} className={`w-full h-9 px-3 flex items-center gap-2 ${t.dim} ${t.hover} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />} <Icon size={14} /> <span className="font-medium">{title}</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
function Slider({ t, label, value, min, max, onChange, onStart, suffix }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs ${t.faint}`}>{label}</span>
        <span className={`text-xs tabular-nums ${t.dim}`}>{Math.round(value)}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onMouseDown={onStart} onTouchStart={onStart}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer accent-blue-600" style={{ background: "currentColor" }} />
    </div>
  );
}
function NumberField({ t, label, value, onChange, onStart }) {
  return (
    <label className="block">
      <span className={`text-xs ${t.faint}`}>{label}</span>
      <input type="number" value={value} onFocus={onStart} onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-8 rounded-md px-2 border ${t.input} outline-none tabular-nums focus-visible:ring-2 focus-visible:ring-blue-500`} />
    </label>
  );
}
