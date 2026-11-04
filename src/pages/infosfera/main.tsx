import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { InfosferaPage } from './InfosferaPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <InfosferaPage />
    </div>
  </React.StrictMode>,
)
