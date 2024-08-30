import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../pages/game/ui/Game/index.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
