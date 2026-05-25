import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { AboutUsPage } from './AboutUsPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <AboutUsPage />
    </div>
  </React.StrictMode>,
)
