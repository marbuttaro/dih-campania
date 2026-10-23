import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { GlossarioPage } from './GlossarioPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <GlossarioPage />
    </div>
  </React.StrictMode>,
)
