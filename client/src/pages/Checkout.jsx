import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    street: '', city: '', phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (cartItems.length === 0) return setError('Your cart is empty')

    setLoading(true)
    setError('')

    try {
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity:   item.quantity,
        size:       item.size || null
      }))

      const res = await api.post('/orders', {
        items,
        delivery_address: address
      })

      clearCart()
     navigate(`/order-confirmation/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      <section id="page-header">
        <h2>Checkout</h2>
        <p>Complete your order</p>
      </section>

      <section id="checkout" className="section-p1">
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

          {/* Delivery details */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3>Delivery details</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCheckout}>
              <input
                name="street"
                placeholder="Street address"
                value={address.street}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                name="phone"
                placeholder="Phone number (e.g. 0712345678)"
                value={address.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
              />
              <button className="normal" type="submit" disabled={loading}>
                {loading ? 'Placing order...' : 'Place order'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h3>Order summary</h3>
            <table width="100%">
              <tbody>
                {cartItems.map((item, i) => (
                  <tr key={i}>
                    <td><img src={`/img/${item.image}`} width="60px" alt={item.name} /></td>
                    <td>{item.name} {item.size && `(${item.size})`}</td>
                    <td>x{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td><strong>${cartTotal.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}