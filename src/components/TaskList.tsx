import { useState } from 'react'
import type { Task } from '../types'

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

  return (
    <section className="card tasks" aria-label="Tarefas">
      <header className="tasks-header">
        <h2>Tarefas</h2>
        {doneCount > 0 && (
          <button className="link" onClick={onClearDone}>
            Limpar concluídas ({doneCount})
          </button>
        )}
      </header>

      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault()
          const title = draft.trim()
          if (!title) return
          onAdd(title)
          setDraft('')
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="No que você vai trabalhar?"
          aria-label="Nova tarefa"
          maxLength={120}
        />
        <button type="submit" disabled={!draft.trim()}>
          Adicionar
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">Nenhuma tarefa ainda. Adicione uma e clique nela para focar.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={['task', task.done && 'done', task.id === activeId && 'active'].filter(Boolean).join(' ')}
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
                aria-label={`Concluir "${task.title}"`}
              />
              <button
                className="task-title"
                onClick={() => onSelect(task.id)}
                disabled={task.done}
                title={task.id === activeId ? 'Tarefa em foco' : 'Focar nesta tarefa'}
              >
                {task.title}
              </button>
              {task.pomodoros > 0 && (
                <span className="task-count" title={`${task.pomodoros} pomodoro(s)`}>
                  🍅 {task.pomodoros}
                </span>
              )}
              <button className="icon" onClick={() => onDelete(task.id)} aria-label={`Excluir "${task.title}"`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
