import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsletterSection from '../components/NewsletterSection'
import { useCart } from '../context/CartContext'

const formatKsh = (value) => `KSh ${Number(value || 0).toLocaleString('en-KE')}`

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      <section id="page-header" className="phone-page-header">
        <p className="eyebrow">COSMY FLAGSHIPS</p>
        <h2>Your cart</h2>
        <p>Review the phones you've selected.</p>
      </section>

      <section id="cart" className="section-p1">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Phone</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Your cart is empty.</p>
                  <p style={{ marginTop: '14px' }}>
                    <Link className="normal" to="/shop">Browse phones</Link>
                  </p>
                </td>
              </tr>
            ) : (
              cartItems.map((item, i) => (
                <tr key={i}>
                  <td>
                    <i
                      className="fa fa-times"
                      style={{ cursor: 'pointer' }}
                      role="button"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeFromCart(item.id, item.size)}
                    ></i>
                  </td>
                  <td>
                    <img
                      src={item.image?.startsWith('http') ? item.image : `/img/${item.image}`}
                      width="80px"
                      alt={item.name}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{formatKsh(item.price)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val)) updateQuantity(item.id, item.size, val)
                      }}
                      style={{ width: '60px' }}
                    />
                  </td>
                  <td>{formatKsh(item.price * item.quantity)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section id="cart-add" className="section-p1">
        <div id="subtotal">
          <h3>Cart total</h3>
          <table>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>{formatKsh(cartTotal)}</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{formatKsh(cartTotal)}</strong></td>
              </tr>
            </tbody>
          </table>
          <p className="cart-note">We confirm availability and condition with you before the sale is final.</p>
          <button
            className="normal"
            onClick={() => navigate('/checkout')}
            disabled={cartItems.length === 0}
          >
            Continue to checkout
          </button>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  )
}
