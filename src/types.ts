export type Task = {
  id: string
  title: string
  done: boolean
  pomodoros: number
}

export type Mode = 'focus' | 'short' | 'long'

export type Settings = {
  /** Durações em minutos. */
  focus: number
  short: number
  long: number
  /** Quantos focos até a pausa longa. */
  longBreakEvery: number
  sound: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longBreakEvery: 4,
  sound: true,
}
