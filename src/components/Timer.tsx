import { formatTime } from '../format'
import { MODE_LABELS, MODES, type Pomodoro } from '../hooks/usePomodoro'
import type { Task } from '../types'

type Props = {
  timer: Pomodoro
  activeTask?: Task
}

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function Timer({ timer, activeTask }: Props) {
  const { mode, remaining, total, running, cycles } = timer
  const progress = 1 - remaining / total

  return (
    <section className="card timer" aria-label="Timer">
      <div className="mode-tabs" role="tablist">
        {MODES.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={m === mode}
            className={m === mode ? 'selected' : ''}
            onClick={() => timer.switchMode(m)}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="dial">
        <svg viewBox="0 0 280 280" aria-hidden="true">
          <circle className="dial-track" cx="140" cy="140" r={RADIUS} />
          <circle
            className="dial-progress"
            cx="140"
            cy="140"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          />
        </svg>
        <div className="dial-content">
          <time className="time" aria-live="off">
            {formatTime(remaining)}
          </time>
          <span className="focus-on">
            {activeTask ? activeTask.title : mode === 'focus' ? 'Sem tarefa selecionada' : 'Hora de descansar'}
          </span>
        </div>
      </div>

      <div className="controls">
        <button className="secondary" onClick={timer.reset} aria-label="Reiniciar" title="Reiniciar">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
          </svg>
        </button>
        <button className="primary" onClick={timer.toggle} title="Espaço">
          {running ? 'Pausar' : 'Iniciar'}
        </button>
        <button className="secondary" onClick={timer.skip} aria-label="Pular" title="Pular">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l10 7-10 7zM19 5v14" />
          </svg>
        </button>
      </div>

      <p className="cycles">
        {cycles === 0 ? 'Nenhum pomodoro concluído ainda' : `${cycles} pomodoro${cycles > 1 ? 's' : ''} concluído${cycles > 1 ? 's' : ''}`}
      </p>
    </section>
  )
}
