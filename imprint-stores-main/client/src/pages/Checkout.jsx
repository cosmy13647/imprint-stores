import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ street: '', city: 'Eldoret', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (cartItems.length === 0) return setError('Your cart is empty')
    setLoading(true)
    setError('')
    try {
      const items = cartItems.map(item => ({ product_id: item.id, quantity: item.quantity }))
      const res = await api.post('/orders', { items, delivery_address: address })
      clearCart()
      navigate(`/order-confirmation/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || "We couldn't send your order request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <section id="page-header" className="phone-page-header">
        <p className="eyebrow">COSMY FLAGSHIPS</p>
        <h2>Request your phone</h2>
        <p>We'll confirm availability and the phone's condition with you before the sale is final.</p>
      </section>

      <section id="checkout" className="section-p1">
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3>Your details</h3>
            {!user && (
              <p style={{ margin: '10px 0' }}>
                Please <Link to="/login" style={{ textDecoration: 'underline' }}>log in</Link> or <Link to="/register" style={{ textDecoration: 'underline' }}>create an account</Link> to send your request.
              </p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCheckout}>
              <input name="street" placeholder="Area / estate" value={address.street} onChange={handleChange} required />
              <input name="city" placeholder="City" value={address.city} onChange={handleChange} required />
              <input name="phone" placeholder="Phone number (WhatsApp if possible)" value={address.phone} onChange={handleChange} required />
              <button className="normal" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send order request'}</button>
            </form>
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3>Order summary</h3>
            {cartItems.length === 0 && (
              <p style={{ margin: '10px 0' }}>Your cart is empty. <Link to="/shop" style={{ textDecoration: 'underline' }}>Browse phones</Link></p>
            )}
            <table width="100%">
              <tbody>
                {cartItems.map((item, i) => (
                  <tr key={i}>
                    <td><img src={item.image?.startsWith('http') ? item.image : `/img/${item.image}`} width="60" alt={item.name} /></td>
                    <td>{item.name}</td>
                    <td>x{item.quantity}</td>
                    <td>KSh {(item.price * item.quantity).toLocaleString('en-KE')}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td><strong>KSh {cartTotal.toLocaleString('en-KE')}</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="dark-text" style={{ marginTop: '18px', fontSize: '14px' }}>
              <strong>What happens next:</strong> your request is saved as a pending order. We confirm that the phone is available and agree on its condition with you, then you can pay with M-Pesa.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
