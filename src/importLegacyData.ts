// Importa os dados que a página de redirecionamento do endereço antigo (GitHub Pages)
// envia no hash da URL. Só preenche chaves que ainda não existem aqui, então nunca
// sobrescreve o que já foi salvo neste endereço.

const VALIDATORS: Record<string, (value: unknown) => boolean> = {
  'tomatask:tasks': (v) =>
    Array.isArray(v) &&
    v.every(
      (t) =>
        typeof t?.id === 'string' &&
        typeof t?.title === 'string' &&
        typeof t?.done === 'boolean' &&
        typeof t?.pomodoros === 'number',
    ),
  'tomatask:active': (v) => v === null || typeof v === 'string',
  'tomatask:cycles': (v) => Number.isInteger(v) && (v as number) >= 0,
  'tomatask:settings': (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
  'tomatask:theme': (v) => v === 'system' || v === 'light' || v === 'dark',
}

export function importLegacyData() {
  const match = location.hash.match(/^#import=(.+)$/)
  if (!match) return

  try {
    const data = JSON.parse(decodeURIComponent(match[1])) as Record<string, unknown>
    for (const [key, raw] of Object.entries(data)) {
      const isValid = VALIDATORS[key]
      if (!isValid || typeof raw !== 'string' || localStorage.getItem(key) !== null) continue
      if (isValid(JSON.parse(raw))) localStorage.setItem(key, raw)
    }
  } catch {
    // Dados inválidos ou armazenamento indisponível: segue sem importar.
  }

  history.replaceState(null, '', location.pathname + location.search)
}
