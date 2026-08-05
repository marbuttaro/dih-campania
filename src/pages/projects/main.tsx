import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { ProjectsPage } from './ProjectsPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <ProjectsPage />
    </div>
  </React.StrictMode>,
)
