import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos-globais.css'
import './styles/scroll-animations.css'
import App from './Aplicacao.jsx'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
