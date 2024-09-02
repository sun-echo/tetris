import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../pages/game/ui/'
import 'material-icons/iconfont/material-icons.css';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
