import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { TrasparenzaPage } from './TrasparenzaPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <TrasparenzaPage />
    </div>
  </React.StrictMode>,
)
