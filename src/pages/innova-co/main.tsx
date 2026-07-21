import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { InnovaCoPage } from './InnovaCoPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <InnovaCoPage />
    </div>
  </React.StrictMode>,
)
