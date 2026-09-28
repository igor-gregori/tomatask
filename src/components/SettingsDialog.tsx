import { useEffect, useRef } from 'react'
import type { Settings } from '../types'
import { CloseIcon, MinusIcon, PlusIcon } from './icons'

type NumericKey = 'focus' | 'short' | 'long' | 'longBreakEvery'

type Props = {
  open: boolean
  settings: Settings
  onClose: () => void
  onStep: (key: NumericKey, value: number, up: boolean) => void
  onToggleSound: () => void
}

type Field = { key: NumericKey; label: string; color?: string; min: number; max: number; step: number; unit: string }

const DURATIONS: Field[] = [
  { key: 'focus', label: 'Foco', color: 'var(--focus)', min: 5, max: 90, step: 5, unit: 'min' },
  { key: 'short', label: 'Pausa curta', color: 'var(--short)', min: 1, max: 30, step: 1, unit: 'min' },
  { key: 'long', label: 'Pausa longa', color: 'var(--long)', min: 5, max: 60, step: 5, unit: 'min' },
]

const CYCLE: Field = { key: 'longBreakEvery', label: 'Pausa longa a cada', min: 2, max: 8, step: 1, unit: 'focos' }

export function SettingsDialog({ open, settings, onClose, onStep, onToggleSound }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // Foca o próprio modal para não destacar o primeiro botão ao abrir.
      dialog.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const row = (field: Field) => {
    const value = settings[field.key]
    const change = (dir: 1 | -1) => {
      const next = Math.min(field.max, Math.max(field.min, value + dir * field.step))
      if (next !== value) onStep(field.key, next, dir === 1)
    }
    return (
      <div className="row" key={field.key}>
        <span className="name">
          {field.color && <i style={{ background: field.color }} />}
          {field.label}
        </span>
        <div className="stepper">
          <button onClick={() => change(-1)} disabled={value <= field.min} aria-label={`Diminuir ${field.label}`}>
            <MinusIcon />
          </button>
          <output aria-live="polite">
            {value} {field.unit}
          </output>
          <button onClick={() => change(1)} disabled={value >= field.max} aria-label={`Aumentar ${field.label}`}>
            <PlusIcon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="settings-title"
      tabIndex={-1}
      onClose={onClose}
      onClick={(e) => {
        // Clique no fundo escurecido fecha o modal.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="sheet">
        <div className="sheet-head">
          <h3 id="settings-title">Configurações</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </button>
        </div>

        <p className="group-label">Durações</p>
        {DURATIONS.map(row)}

        <p className="group-label">Ciclo</p>
        {row(CYCLE)}

        <p className="group-label">Preferências</p>
        <div className="row">
          <span className="name" id="sound-label">
            Sons
          </span>
          <button className="switch" role="switch" aria-checked={settings.sound} aria-labelledby="sound-label" onClick={onToggleSound} />
        </div>

        <button className="sheet-done" onClick={onClose}>
          Pronto
        </button>
      </div>
    </dialog>
  )
}
