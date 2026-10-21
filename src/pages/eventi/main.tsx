import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { EventsPage } from './EventsPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <EventsPage />
    </div>
  </React.StrictMode>,
)
