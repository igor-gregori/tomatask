import { THEME_LABELS, type ThemePref } from '../hooks/useTheme'
import { MonitorIcon, MoonIcon, SlidersIcon, SunIcon } from './icons'

type Props = {
  themePref: ThemePref
  onCycleTheme: () => void
  onOpenSettings: () => void
}

const THEME_ICONS = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
}

export function Header({ themePref, onCycleTheme, onOpenSettings }: Props) {
  const ThemeIcon = THEME_ICONS[themePref]
  const themeLabel = `Tema: ${THEME_LABELS[themePref]} (clique para trocar)`

  return (
    <header className="top">
      <span className="brand">tomatask</span>
      <div className="actions">
        <button className="icon-btn" onClick={onOpenSettings} aria-label="Configurações" title="Configurações">
          <SlidersIcon />
        </button>
        <button className="icon-btn" onClick={onCycleTheme} aria-label={themeLabel} title={themeLabel}>
          <ThemeIcon />
        </button>
      </div>
    </header>
  )
}
