import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { IntelligenzaArtificialePage } from './IntelligenzaArtificialePage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <IntelligenzaArtificialePage />
    </div>
  </React.StrictMode>,
)
