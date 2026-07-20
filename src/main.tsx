import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Apply dark class before first paint to prevent flash
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const stored = localStorage.getItem('hurrcut-theme')
if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
