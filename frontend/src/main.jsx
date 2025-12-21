import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { SocketProvider } from './context/SocketProvider.jsx'
import { ToastProvider } from './components/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SocketProvider>
  </StrictMode>,
)

