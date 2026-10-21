import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/index.css'
import { NewsPage } from './NewsPage'

// Each news/<slug>.html declares which article it shows on the root element
const root = document.getElementById('root')!

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div className="flex flex-col min-h-screen">
      <NewsPage slug={root.dataset.news ?? ''} />
    </div>
  </React.StrictMode>,
)
