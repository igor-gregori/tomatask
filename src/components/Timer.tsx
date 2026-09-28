import { formatTime } from '../format'
import { MODE_LABELS, MODES, type Pomodoro } from '../hooks/usePomodoro'
import type { Mode, Task } from '../types'
import { ResetIcon, SkipIcon } from './icons'

type Props = {
  timer: Pomodoro
  activeTask?: Task
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
  onSwitchMode: (mode: Mode) => void
}

export function Timer({ timer, activeTask, onToggle, onReset, onSkip, onSwitchMode }: Props) {
  const { mode, remaining, total, running, cycleProgress, longBreakEvery } = timer
  const idle = remaining >= total

  const label = mode !== 'focus' ? 'Hora de descansar' : (activeTask?.title ?? 'Sem tarefa selecionada')

  return (
    <section className="card timer" aria-label="Timer">
      <div className="modes" role="tablist">
        {MODES.map((m) => (
          <button key={m} role="tab" aria-selected={m === mode} onClick={() => onSwitchMode(m)}>
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      <div className="clock">
        <svg className="ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="track" cx="50" cy="50" r="46" />
          <circle
            className={`prog${idle ? ' idle' : ''}`}
            cx="50"
            cy="50"
            r="46"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * Math.min(1, remaining / total)}
          />
        </svg>
        <div className="clock-inner">
          <time className="time">{formatTime(remaining)}</time>
          <span className="label" title={label}>
            {label}
          </span>
        </div>
      </div>

      <div className="controls">
        <button className="ctrl" onClick={onReset} aria-label="Reiniciar" title="Reiniciar">
          <ResetIcon />
        </button>
        <button className="primary" onClick={onToggle} title="Atalho: barra de espaço">
          {running ? 'Pausar' : 'Iniciar'}
        </button>
        <button className="ctrl" onClick={onSkip} aria-label="Pular" title="Pular">
          <SkipIcon />
        </button>
      </div>

      <p className="cycles-text">
        {cycleProgress} de {longBreakEvery} até a pausa longa
      </p>
    </section>
  )
}
