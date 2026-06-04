// Effects worker — off-main-thread effect processing (chroma key, LUT, etc.)
// Phase 9 scaffold: message contracts defined; heavy processing is TODO Phase 9+

type EffectsMsg =
  | { type: 'ping' }
  | { type: 'apply'; clipId: string; effect: string; params: Record<string, number> }

type EffectsReply =
  | { type: 'pong' }
  | { type: 'done'; clipId: string }
  | { type: 'error'; clipId: string; message: string }

self.onmessage = (e: MessageEvent<EffectsMsg>) => {
  const msg = e.data
  switch (msg.type) {
    case 'ping': {
      self.postMessage({ type: 'pong' } satisfies EffectsReply)
      break
    }
    case 'apply': {
      // TODO: Phase 9+ — chroma key, LUT application, advanced filter processing
      self.postMessage({ type: 'done', clipId: msg.clipId } satisfies EffectsReply)
      break
    }
  }
}
