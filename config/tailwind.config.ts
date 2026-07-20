import type { Config } from "tailwindcss";

/**
 * HurrCut design tokens — minimal-UI system.
 * Encodes the manual's §6 constraints into the toolchain so screens can't drift.
 *
 * Rules this config assumes (see CLAUDE.md / docs/minimal-ui-manual.md):
 *  - Spacing: Tailwind's default 4px scale IS the grid. Never use off-grid
 *    arbitrary spacing (`p-[7px]`). Bracket values are allowed only for
 *    non-spacing one-offs.
 *  - Color: `surface*/fg*/border` (neutral base) + ONE `accent` (primary path
 *    to outcome = Export). The `signal.*` namespace is the sanctioned data-viz
 *    exception — one hue per meaning, never decorative, never the sole signal.
 *  - Radius: surfaces cap at `rounded-lg`; `rounded-full` for badges only.
 *  - Type: one UI sans + one mono; ≤3 weights, ≤4 sizes per screen.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Neutral base — resolved from CSS variables in globals.css (light + .dark).
        surface: {
          DEFAULT: "rgb(var(--surface-0) / <alpha-value>)",
          1: "rgb(var(--surface-1) / <alpha-value>)",
          2: "rgb(var(--surface-2) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          dim: "rgb(var(--fg-dim) / <alpha-value>)",
          faint: "rgb(var(--fg-faint) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong) / <alpha-value>)",

        // The single accent — primary path to outcome (Export). Nothing else.
        // Chosen distinct from signal.video so it never reads as track color.
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
        },

        // Data-viz / semantic SIGNAL — the §5 exception, namespaced and fixed
        // across themes. One hue = one meaning. Pair with icon/text, never alone.
        signal: {
          video: "#58d3ff",
          image: "#58d3ff",
          audio: "#86e89f",
          text: "#f2cf67",
          shape: "#c7a5ff",
          overlay: "#c7a5ff",
          playhead: "#ff856f",
          ok: "#86e89f",
          warn: "#f5b13d",
          error: "#f0606b",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        // Mono for timecodes / tabular data (use with `tabular-nums`).
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        // Crisp geometric surfaces (Mid-Century Modern). Cap at lg; full for badges only.
        DEFAULT: "3px",
        md: "3px",
        lg: "5px",
      },
      boxShadow: {
        // Elevation only for real floating elements (menus, popovers, dialogs, toasts).
        // No decorative shadows on cards/containers.
        elevate: "0 8px 24px rgb(0 0 0 / 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
