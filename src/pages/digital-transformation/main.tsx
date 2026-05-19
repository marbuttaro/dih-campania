import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { DigitalTransformationPage } from './DigitalTransformationPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <DigitalTransformationPage />
    </div>
  </React.StrictMode>,
)
