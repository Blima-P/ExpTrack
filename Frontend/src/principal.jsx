import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos-globais.css'
import App from './Aplicacao.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
