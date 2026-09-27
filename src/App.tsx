import { useCallback, useEffect } from 'react'
import { TaskList } from './components/TaskList'
import { Timer } from './components/Timer'
import { formatTime } from './format'
import { useLocalStorage } from './hooks/useLocalStorage'
import { MODE_LABELS, usePomodoro } from './hooks/usePomodoro'
import type { Task } from './types'

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tomatask:tasks', [])
  const [activeId, setActiveId] = useLocalStorage<string | null>('tomatask:active', null)

  const handleFocusComplete = useCallback(() => {
    if (!activeId) return
    setTasks((ts) => ts.map((t) => (t.id === activeId ? { ...t, pomodoros: t.pomodoros + 1 } : t)))
  }, [activeId, setTasks])

  const timer = usePomodoro(handleFocusComplete)
  const activeTask = tasks.find((t) => t.id === activeId)

  useEffect(() => {
    document.title = `${formatTime(timer.remaining)} · ${MODE_LABELS[timer.mode]} — tomatask`
  }, [timer.remaining, timer.mode])

  // Barra de espaço inicia/pausa, exceto quando o foco está num campo ou botão.
  const { toggle } = timer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      const target = e.target as HTMLElement
      if (target.closest('input, textarea, button')) return
      e.preventDefault()
      toggle()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  const addTask = (title: string) => {
    const task: Task = { id: crypto.randomUUID(), title, done: false, pomodoros: 0 }
    setTasks((ts) => [...ts, task])
    if (!activeId) setActiveId(task.id)
  }

  const toggleTask = (id: string) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
    if (id === activeId) setActiveId(null)
  }

  const deleteTask = (id: string) => {
    setTasks((ts) => ts.filter((t) => t.id !== id))
    if (id === activeId) setActiveId(null)
  }

  const selectTask = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
  }

  const clearDone = () => {
    setTasks((ts) => ts.filter((t) => !t.done))
  }

  return (
    <div className="page" data-mode={timer.mode}>
      <main className="app">
        <h1 className="brand">
          <span aria-hidden="true">🍅</span> tomatask
        </h1>
        <Timer timer={timer} activeTask={activeTask} />
        <TaskList
          tasks={tasks}
          activeId={activeId}
          onAdd={addTask}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onSelect={selectTask}
          onClearDone={clearDone}
        />
      </main>
    </div>
  )
}
