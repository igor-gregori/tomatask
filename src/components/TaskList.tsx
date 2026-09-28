import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'
import { CheckIcon, CloseIcon, PlusIcon } from './icons'

type Props = {
  tasks: Task[]
  activeId: string | null
  onAdd: (title: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onClearDone: () => void
}

export function TaskList({ tasks, activeId, onAdd, onToggle, onDelete, onSelect, onClearDone }: Props) {
  const [draft, setDraft] = useState('')
  const doneCount = tasks.filter((t) => t.done).length

  // Ao adicionar, rola a lista até a nova tarefa.
  const listRef = useRef<HTMLUListElement>(null)
  const prevCount = useRef(tasks.length)
  useEffect(() => {
    if (tasks.length > prevCount.current) {
      listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest' })
    }
    prevCount.current = tasks.length
  }, [tasks.length])

  return (
    <section className="card tasks" aria-label="Tarefas">
      <div className="tasks-head">
        <h2>Tarefas</h2>
        <div className="tasks-meta">
          {doneCount > 0 && (
            <button className="link" onClick={onClearDone}>
              Limpar concluídas
            </button>
          )}
          {tasks.length > 0 && (
            <span className="count">
              {doneCount}/{tasks.length}
            </span>
          )}
        </div>
      </div>

      <form
        className="add"
        onSubmit={(e) => {
          e.preventDefault()
          const title = draft.trim()
          if (!title) return
          onAdd(title)
          setDraft('')
        }}
      >
        <PlusIcon />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Adicionar tarefa"
          aria-label="Nova tarefa"
          maxLength={120}
          autoComplete="off"
        />
      </form>

      <ul className="task-list" ref={listRef}>
        {tasks.length === 0 && <li className="empty">Nenhuma tarefa ainda</li>}
        {tasks.map((task) => (
          <li
            key={task.id}
            className={['task', task.done && 'done', task.id === activeId && 'active'].filter(Boolean).join(' ')}
          >
            <button
              className="check"
              onClick={() => onToggle(task.id)}
              role="checkbox"
              aria-checked={task.done}
              aria-label={`Concluir "${task.title}"`}
            >
              <CheckIcon />
            </button>
            <button
              className="title"
              onClick={() => onSelect(task.id)}
              disabled={task.done}
              title={task.id === activeId ? 'Tarefa em foco' : 'Focar nesta tarefa'}
            >
              {task.title}
            </button>
            {task.pomodoros > 0 && (
              <span className="pomos" title={`${task.pomodoros} pomodoro(s)`}>
                {Array.from({ length: Math.min(task.pomodoros, 8) }, (_, i) => (
                  <i key={i} />
                ))}
                {task.pomodoros > 8 && <small>+{task.pomodoros - 8}</small>}
              </span>
            )}
            <button className="del" onClick={() => onDelete(task.id)} aria-label={`Excluir "${task.title}"`}>
              <CloseIcon />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
