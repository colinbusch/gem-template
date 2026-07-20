// Export worker — frame scheduling and progress tracking for export pipeline
// Phase 9 note: MediaRecorder requires a main-thread canvas, so this worker
// handles coordination only. Phase 9+ will add FFmpeg WASM encoding here.

type ExportMsg =
  | { type: 'ping' }
  | { type: 'start'; duration: number; fps: number }
  | { type: 'cancel' }

type ExportReply =
  | { type: 'pong' }
  | { type: 'progress'; pct: number }
  | { type: 'done' }
  | { type: 'error'; message: string }

let intervalId: ReturnType<typeof setInterval> | null = null

self.onmessage = (e: MessageEvent<ExportMsg>) => {
  const msg = e.data
  switch (msg.type) {
    case 'ping': {
      self.postMessage({ type: 'pong' } satisfies ExportReply)
      break
    }
    case 'start': {
      if (intervalId !== null) clearInterval(intervalId)
      const { duration, fps } = msg
      const totalFrames = Math.ceil(duration * fps)
      let frame = 0
      intervalId = setInterval(() => {
        if (frame > totalFrames) {
          clearInterval(intervalId!)
          intervalId = null
          self.postMessage({ type: 'done' } satisfies ExportReply)
          return
        }
        self.postMessage({ type: 'progress', pct: Math.round((frame / totalFrames) * 100) } satisfies ExportReply)
        frame++
      }, 1000 / fps)
      break
    }
    case 'cancel': {
      if (intervalId !== null) { clearInterval(intervalId); intervalId = null }
      break
    }
  }
}
