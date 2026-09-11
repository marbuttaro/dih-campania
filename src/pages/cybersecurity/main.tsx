import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { CybersecurityPage } from './CybersecurityPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <CybersecurityPage />
    </div>
  </React.StrictMode>,
)
