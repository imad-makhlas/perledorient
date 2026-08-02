import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './features/cart/cart-context'
import { I18nProvider } from './i18n/i18n'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><BrowserRouter><I18nProvider><CartProvider><App /></CartProvider></I18nProvider></BrowserRouter></StrictMode>,
)
