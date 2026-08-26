import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import dayjs from 'dayjs'
import 'dayjs/locale/it'
import 'dayjs/locale/pt'
import './index.css'
import i18n from './i18n'
import App from './App.tsx'

dayjs.locale(i18n.language)
i18n.on('languageChanged', (lng) => dayjs.locale(lng))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
