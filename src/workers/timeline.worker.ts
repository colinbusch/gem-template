// Timeline worker — background timeline processing (waveform gen, thumbnail gen)
// Phase 9 scaffold: message contracts defined; processing is TODO Phase 9+

type TimelineMsg =
  | { type: 'ping' }
  | { type: 'generate-waveform'; assetId: string; url: string }
  | { type: 'generate-thumbnail'; assetId: string; url: string; time: number }

type TimelineReply =
  | { type: 'pong' }
  | { type: 'waveform'; assetId: string; data: Float32Array }
  | { type: 'thumbnail'; assetId: string; dataUrl: string }
  | { type: 'error'; assetId: string; message: string }

self.onmessage = (e: MessageEvent<TimelineMsg>) => {
  const msg = e.data
  switch (msg.type) {
    case 'ping': {
      self.postMessage({ type: 'pong' } satisfies TimelineReply)
      break
    }
    case 'generate-waveform':
    case 'generate-thumbnail': {
      // TODO: Phase 9+ — AudioContext waveform sampling, OffscreenCanvas thumbnail
      const reply: TimelineReply = { type: 'error', assetId: msg.assetId, message: 'TODO Phase 9+' }
      self.postMessage(reply)
      break
    }
  }
}
