import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import './index.css'
import App from './App.tsx'
import { importLegacyData } from './importLegacyData'

// Precisa rodar antes do React ler o localStorage.
importLegacyData()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
