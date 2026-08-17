import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileBottomNavigation } from './components/layout/MobileBottomNavigation'
import { CartPage } from './pages/CartPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { CataloguePage } from './pages/CataloguePage'
import { WhatsAppCheckoutPage } from './pages/WhatsAppCheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { BrandContentPage } from './pages/BrandContentPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'

export default function App() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  return <div className={`min-h-screen bg-canvas text-ink ${isAdmin ? '' : 'pb-[calc(76px+env(safe-area-inset-bottom))] lg:pb-0'}`}>{!isAdmin && <Header />}<div key={pathname} className={isAdmin ? undefined : 'storefront-page-transition'}><Routes><Route path="/" element={<HomePage />} /><Route path="/catalogue" element={<CataloguePage />} /><Route path="/products/:slug" element={<ProductPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<WhatsAppCheckoutPage />} /><Route path="/order-confirmation" element={<ConfirmationPage />} /><Route path="/admin/orders" element={<Navigate to="/admin" replace />} /><Route path="/admin" element={<AdminDashboardPage />} /><Route path="/admin/products" element={<Navigate to="/admin" replace />} /><Route path="/about" element={<AboutPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="/delivery" element={<BrandContentPage />} /><Route path="/returns" element={<BrandContentPage />} /><Route path="/tracking" element={<BrandContentPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></div>{!isAdmin && <><Footer /><MobileBottomNavigation /></>}</div>
}
