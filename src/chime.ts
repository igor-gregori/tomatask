// Toca um pequeno arpejo com a Web Audio API, sem precisar de arquivo de som.
export function playChime() {
  try {
    const ctx = new AudioContext()
    const notes = [880, 1175, 1568]

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = ctx.currentTime + i * 0.18

      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.6)

      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 0.6)
    })

    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Sem suporte a áudio; o aviso visual continua funcionando.
  }
}
