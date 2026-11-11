import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { BandiPage } from './BandiPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <BandiPage />
    </div>
  </React.StrictMode>,
)
