// Async media metadata extraction — runs in the browser, no server needed.
// Each function creates its own object URL and keeps it alive (caller owns cleanup).

export interface VideoMeta {
  url: string
  duration: number
  thumbnail: string  // JPEG data URL, 160×90
  width: number
  height: number
}

export interface AudioMeta {
  url: string
  duration: number
}

export interface ImageMeta {
  url: string
  width: number
  height: number
}

export function extractVideoMeta(file: File): Promise<VideoMeta> {
  const url = URL.createObjectURL(file)
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    video.src = url

    const finish = (thumbnail: string) => {
      resolve({ url, duration: isFinite(video.duration) ? video.duration : 0, thumbnail, width: video.videoWidth, height: video.videoHeight })
    }

    video.addEventListener('loadedmetadata', () => {
      // Seek to 10 % of duration or 0.5 s, whichever is less
      video.currentTime = Math.min(0.5, (video.duration || 0) * 0.1)
    }, { once: true })

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 160
        canvas.height = 90
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(video, 0, 0, 160, 90)
        finish(canvas.toDataURL('image/jpeg', 0.6))
      } catch {
        finish('')
      }
    }, { once: true })

    video.addEventListener('error', () => finish(''), { once: true })
  })
}

export function extractAudioMeta(file: File): Promise<AudioMeta> {
  const url = URL.createObjectURL(file)
  return new Promise((resolve) => {
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.src = url
    audio.addEventListener('loadedmetadata', () => resolve({ url, duration: isFinite(audio.duration) ? audio.duration : 0 }), { once: true })
    audio.addEventListener('error', () => resolve({ url, duration: 0 }), { once: true })
  })
}

export function extractImageMeta(file: File): Promise<ImageMeta> {
  const url = URL.createObjectURL(file)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ url, width: 0, height: 0 })
    img.src = url
  })
}
