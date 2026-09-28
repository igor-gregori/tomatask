// Sons de interface sintetizados com a Web Audio API, sem arquivos de áudio.

export type SoundName =
  | 'tick'
  | 'start'
  | 'pause'
  | 'check'
  | 'uncheck'
  | 'add'
  | 'remove'
  | 'stepUp'
  | 'stepDown'
  | 'done'

type Tone = {
  freq: number
  to?: number
  at?: number
  dur?: number
  vol?: number
  type?: OscillatorType
}

let enabled = true
let ctx: AudioContext | null = null
let master: GainNode | null = null

export function setSoundEnabled(value: boolean) {
  enabled = value
}

function output() {
  if (!ctx || !master) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.5
    // Um passa-baixa leve deixa os timbres mais macios.
    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 4000
    master.connect(lowpass).connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return { ctx, master }
}

// Uma nota: ataque rápido, decaimento exponencial e deslize de tom opcional.
function tone({ freq, to = freq, at = 0, dur = 0.12, vol = 0.2, type = 'sine' }: Tone) {
  const { ctx, master } = output()
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to !== freq) osc.frequency.exponentialRampToValueAtTime(to, t + dur * 0.6)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

  osc.connect(gain).connect(master)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

const SOUNDS: Record<SoundName, () => void> = {
  tick: () => tone({ freq: 1760, to: 1320, dur: 0.05, vol: 0.07, type: 'triangle' }),
  start: () => {
    tone({ freq: 659, dur: 0.16, vol: 0.16 })
    tone({ freq: 988, at: 0.07, dur: 0.22, vol: 0.14 })
  },
  pause: () => {
    tone({ freq: 988, dur: 0.14, vol: 0.13 })
    tone({ freq: 659, at: 0.07, dur: 0.2, vol: 0.14 })
  },
  check: () => {
    tone({ freq: 520, to: 1040, dur: 0.1, vol: 0.18 })
    tone({ freq: 1568, at: 0.05, dur: 0.16, vol: 0.06 })
  },
  uncheck: () => tone({ freq: 700, to: 420, dur: 0.1, vol: 0.14 }),
  add: () => tone({ freq: 660, to: 880, dur: 0.09, vol: 0.14 }),
  remove: () => tone({ freq: 360, to: 200, dur: 0.12, vol: 0.18 }),
  stepUp: () => tone({ freq: 1320, dur: 0.05, vol: 0.07, type: 'triangle' }),
  stepDown: () => tone({ freq: 1100, dur: 0.05, vol: 0.07, type: 'triangle' }),
  done: () => [523, 659, 784, 1047].forEach((freq, i) => tone({ freq, at: i * 0.13, dur: 0.9, vol: 0.13 })),
}

export function playSound(name: SoundName) {
  if (!enabled) return
  try {
    SOUNDS[name]()
  } catch {
    // Sem suporte a áudio; a interface segue funcionando em silêncio.
  }
}
