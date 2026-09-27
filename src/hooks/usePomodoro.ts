import { useCallback, useEffect, useRef, useState } from 'react'
import { playChime } from '../chime'
import { useLocalStorage } from './useLocalStorage'

export type Mode = 'focus' | 'short' | 'long'

export const MODES: Mode[] = ['focus', 'short', 'long']

export const MODE_LABELS: Record<Mode, string> = {
  focus: 'Foco',
  short: 'Pausa curta',
  long: 'Pausa longa',
}

// Duração de cada modo, em segundos.
export const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const LONG_BREAK_EVERY = 4

function secondsUntil(endAt: number) {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
}

export function usePomodoro(onFocusComplete: () => void) {
  const [mode, setMode] = useState<Mode>('focus')
  const [remaining, setRemaining] = useState(DURATIONS.focus)
  // Guardamos o instante de término em vez de decrementar a cada tick,
  // assim o timer não atrasa quando o navegador desacelera abas em segundo plano.
  const [endAt, setEndAt] = useState<number | null>(null)
  const [cycles, setCycles] = useLocalStorage('tomatask:cycles', 0)

  const onFocusCompleteRef = useRef(onFocusComplete)
  useEffect(() => {
    onFocusCompleteRef.current = onFocusComplete
  }, [onFocusComplete])

  const switchMode = useCallback((next: Mode) => {
    setMode(next)
    setRemaining(DURATIONS[next])
    setEndAt(null)
  }, [])

  useEffect(() => {
    if (endAt === null) return

    const finish = () => {
      playChime()
      if (mode === 'focus') {
        const completed = cycles + 1
        setCycles(completed)
        onFocusCompleteRef.current()
        switchMode(completed % LONG_BREAK_EVERY === 0 ? 'long' : 'short')
      } else {
        switchMode('focus')
      }
    }

    const tick = () => {
      const left = secondsUntil(endAt)
      setRemaining(left)
      if (left === 0) {
        clearInterval(id)
        finish()
      }
    }

    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [endAt, mode, cycles, setCycles, switchMode])

  const running = endAt !== null

  const start = useCallback(() => {
    setEndAt(Date.now() + remaining * 1000)
  }, [remaining])

  const pause = useCallback(() => {
    if (endAt === null) return
    setRemaining(secondsUntil(endAt))
    setEndAt(null)
  }, [endAt])

  const toggle = running ? pause : start

  const reset = useCallback(() => {
    setRemaining(DURATIONS[mode])
    setEndAt(null)
  }, [mode])

  const skip = useCallback(() => {
    switchMode(mode === 'focus' ? 'short' : 'focus')
  }, [mode, switchMode])

  return {
    mode,
    remaining,
    total: DURATIONS[mode],
    running,
    cycles,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
  }
}

export type Pomodoro = ReturnType<typeof usePomodoro>
