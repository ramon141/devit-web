import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import dayjs from 'dayjs'
import 'dayjs/locale/it'
import './index.css'
import App from './App.tsx'

dayjs.locale('it')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
