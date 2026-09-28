import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { SettingsDialog } from './components/SettingsDialog'
import { TaskList } from './components/TaskList'
import { Timer } from './components/Timer'
import { formatTime } from './format'
import { useLocalStorage } from './hooks/useLocalStorage'
import { MODE_LABELS, usePomodoro } from './hooks/usePomodoro'
import { useTheme } from './hooks/useTheme'
import { playSound, setSoundEnabled } from './sounds'
import { DEFAULT_SETTINGS, type Mode, type Settings, type Task } from './types'

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tomatask:tasks', [])
  const [activeId, setActiveId] = useLocalStorage<string | null>('tomatask:active', null)
  const [storedSettings, setStoredSettings] = useLocalStorage<Partial<Settings>>('tomatask:settings', {})
  const settings: Settings = { ...DEFAULT_SETTINGS, ...storedSettings }
  const [settingsOpen, setSettingsOpen] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setSoundEnabled(settings.sound)
  }, [settings.sound])

  const handleFocusComplete = useCallback(() => {
    if (!activeId) return
    setTasks((ts) => ts.map((t) => (t.id === activeId ? { ...t, pomodoros: t.pomodoros + 1 } : t)))
  }, [activeId, setTasks])

  const timer = usePomodoro({
    minutes: { focus: settings.focus, short: settings.short, long: settings.long },
    longBreakEvery: settings.longBreakEvery,
    onFocusComplete: handleFocusComplete,
  })
  const activeTask = tasks.find((t) => t.id === activeId)

  useEffect(() => {
    document.title = `${formatTime(timer.remaining)} · ${MODE_LABELS[timer.mode]} — tomatask`
  }, [timer.remaining, timer.mode])

  // A cor de destaque acompanha o modo (vermelho, verde ou azul).
  useEffect(() => {
    document.documentElement.dataset.mode = timer.mode
  }, [timer.mode])

  /* Timer */

  const { running, toggle } = timer
  const toggleTimer = useCallback(() => {
    playSound(running ? 'pause' : 'start')
    toggle()
  }, [running, toggle])

  const switchMode = (mode: Mode) => {
    if (mode === timer.mode) return
    playSound('tick')
    timer.switchMode(mode)
  }

  const resetTimer = () => {
    playSound('tick')
    timer.reset()
  }

  const skipTimer = () => {
    playSound('tick')
    timer.skip()
  }

  // Barra de espaço inicia/pausa, exceto quando o foco está num campo, botão ou modal.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, button, dialog')) return
      e.preventDefault()
      toggleTimer()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleTimer])

  /* Tarefas */

  const addTask = (title: string) => {
    playSound('add')
    const task: Task = { id: crypto.randomUUID(), title, done: false, pomodoros: 0 }
    setTasks((ts) => [...ts, task])
    if (!activeId) setActiveId(task.id)
  }

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    playSound(task.done ? 'uncheck' : 'check')
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    if (!task.done && id === activeId) setActiveId(null)
  }

  const deleteTask = (id: string) => {
    playSound('remove')
    setTasks((ts) => ts.filter((t) => t.id !== id))
    if (id === activeId) setActiveId(null)
  }

  const selectTask = (id: string) => {
    playSound('tick')
    setActiveId((current) => (current === id ? null : id))
  }

  const clearDone = () => {
    playSound('remove')
    setTasks((ts) => ts.filter((t) => !t.done))
  }

  /* Configurações e tema */

  const openSettings = () => {
    playSound('tick')
    setSettingsOpen(true)
  }

  const closeSettings = () => {
    if (!settingsOpen) return
    playSound('tick')
    setSettingsOpen(false)
  }

  const stepSetting = (key: 'focus' | 'short' | 'long' | 'longBreakEvery', value: number, up: boolean) => {
    playSound(up ? 'stepUp' : 'stepDown')
    setStoredSettings((s) => ({ ...s, [key]: value }))
  }

  const toggleSound = () => {
    const sound = !settings.sound
    setSoundEnabled(sound)
    if (sound) playSound('check')
    setStoredSettings((s) => ({ ...s, sound }))
  }

  const cycleTheme = () => {
    playSound('tick')
    theme.cycle()
  }

  return (
    <div className="app">
      <Header themePref={theme.pref} onCycleTheme={cycleTheme} onOpenSettings={openSettings} />
      <main className="layout">
        <div className="panes">
          <Timer
            timer={timer}
            activeTask={activeTask}
            onToggle={toggleTimer}
            onReset={resetTimer}
            onSkip={skipTimer}
            onSwitchMode={switchMode}
          />
          <TaskList
            tasks={tasks}
            activeId={activeId}
            onAdd={addTask}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onSelect={selectTask}
            onClearDone={clearDone}
          />
        </div>
      </main>
      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onClose={closeSettings}
        onStep={stepSetting}
        onToggleSound={toggleSound}
      />
    </div>
  )
}
