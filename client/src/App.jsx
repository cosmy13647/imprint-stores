import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/shop"     element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/cart"     element={<Cart />} />
        <Route path="/login"    element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/checkout" element={<Checkout />} />
         <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}