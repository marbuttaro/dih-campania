import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { CreditoImpostaPage } from './CreditoImpostaPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <CreditoImpostaPage />
    </div>
  </React.StrictMode>,
)
