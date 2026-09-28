import { useCallback, useEffect, useRef, useState } from 'react'
import { playSound } from '../sounds'
import type { Mode } from '../types'
import { useLocalStorage } from './useLocalStorage'

export const MODES: Mode[] = ['focus', 'short', 'long']

export const MODE_LABELS: Record<Mode, string> = {
  focus: 'Foco',
  short: 'Pausa curta',
  long: 'Pausa longa',
}

type Options = {
  /** Duração de cada modo, em minutos. */
  minutes: Record<Mode, number>
  longBreakEvery: number
  onFocusComplete: () => void
}

function secondsUntil(endAt: number) {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000))
}

export function usePomodoro({ minutes, longBreakEvery, onFocusComplete }: Options) {
  const [mode, setMode] = useState<Mode>('focus')
  const total = minutes[mode] * 60
  const [remaining, setRemaining] = useState(total)
  // Guardamos o instante de término em vez de decrementar a cada tick,
  // assim o timer não atrasa quando o navegador desacelera abas em segundo plano.
  const [endAt, setEndAt] = useState<number | null>(null)
  const [cycles, setCycles] = useLocalStorage('tomatask:cycles', 0)

  // Mudar a duração do modo atual nas configurações reinicia o timer, se ele estiver parado.
  const [prevTotal, setPrevTotal] = useState(total)
  if (total !== prevTotal) {
    setPrevTotal(total)
    if (endAt === null) setRemaining(total)
  }

  const onFocusCompleteRef = useRef(onFocusComplete)
  useEffect(() => {
    onFocusCompleteRef.current = onFocusComplete
  }, [onFocusComplete])

  const minutesRef = useRef(minutes)
  useEffect(() => {
    minutesRef.current = minutes
  }, [minutes])

  const switchMode = useCallback((next: Mode) => {
    setMode(next)
    setRemaining(minutesRef.current[next] * 60)
    setEndAt(null)
  }, [])

  useEffect(() => {
    if (endAt === null) return

    const finish = () => {
      playSound('done')
      if (mode === 'focus') {
        const completed = cycles + 1
        setCycles(completed)
        onFocusCompleteRef.current()
        switchMode(completed % longBreakEvery === 0 ? 'long' : 'short')
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
  }, [endAt, mode, cycles, longBreakEvery, setCycles, switchMode])

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
    switchMode(mode)
  }, [mode, switchMode])

  const skip = useCallback(() => {
    switchMode(mode === 'focus' ? 'short' : 'focus')
  }, [mode, switchMode])

  // Quantos focos do ciclo atual já foram feitos (na pausa longa, o ciclo está completo).
  const cycleProgress = mode === 'long' ? longBreakEvery : cycles % longBreakEvery

  return {
    mode,
    remaining,
    total,
    running,
    cycles,
    cycleProgress,
    longBreakEvery,
    toggle,
    reset,
    skip,
    switchMode,
  }
}

export type Pomodoro = ReturnType<typeof usePomodoro>
