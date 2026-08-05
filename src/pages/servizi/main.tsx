import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { ServiziPage } from './ServiziPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <ServiziPage />
    </div>
  </React.StrictMode>,
)
