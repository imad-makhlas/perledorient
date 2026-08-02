import { MessageCircle } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileBottomNavigation } from './components/layout/MobileBottomNavigation'
import { CartPage } from './pages/CartPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'
import { AdminProductsPage } from './pages/AdminProductsPage'
import { CataloguePage } from './pages/CataloguePage'
import { WhatsAppCheckoutPage } from './pages/WhatsAppCheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { BrandContentPage } from './pages/BrandContentPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'

export default function App() {
  return <div className="min-h-screen bg-canvas pb-[calc(76px+env(safe-area-inset-bottom))] text-ink lg:pb-0"><Header /><Routes><Route path="/" element={<HomePage />} /><Route path="/catalogue" element={<CataloguePage />} /><Route path="/products/:slug" element={<ProductPage />} /><Route path="/cart" element={<CartPage />} /><Route path="/checkout" element={<WhatsAppCheckoutPage />} /><Route path="/order-confirmation" element={<ConfirmationPage />} /><Route path="/admin/orders" element={<AdminOrdersPage />} /><Route path="/admin/products" element={<AdminProductsPage />} /><Route path="/about" element={<BrandContentPage />} /><Route path="/contact" element={<BrandContentPage />} /><Route path="/delivery" element={<BrandContentPage />} /><Route path="/returns" element={<BrandContentPage />} /><Route path="/tracking" element={<BrandContentPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes><Footer /><a href="https://wa.me/212600000000" target="_blank" rel="noreferrer" className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lift lg:bottom-5" aria-label="WhatsApp support"><MessageCircle size={24} /></a><MobileBottomNavigation /></div>
}
