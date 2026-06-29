import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsletterSection from '../components/NewsletterSection'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
const navigate = useNavigate()
  return (
    <>
      <Navbar />

      <section id="page-header">
        <h2>#Your Cart</h2>
        <p>Review your selected items</p>
      </section>

      <section id="cart" className="section-p1">
        <table width="100%">
          <thead>
            <tr>
              <td>Remove</td>
              <td>Image</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  Your cart is empty
                </td>
              </tr>
            ) : (
              cartItems.map((item, i) => (
                <tr key={i}>
                  <td>
                    <i
                      className="fa fa-times"
                      style={{ cursor: 'pointer' }}
                      onClick={() => removeFromCart(item.id, item.size)}
                    ></i>
                  </td>
                  <td><img src={`/img/${item.image}`} width="80px" alt={item.name} /></td>
                  <td>{item.name} {item.size && `(${item.size})`}</td>
                  <td>${item.price}</td>
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
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section id="cart-add" className="section-p1">
        <div id="coupon">
          <h3>Apply coupon</h3>
          <input type="text" placeholder="Enter your coupon" />
          <button className="normal">Apply</button>
        </div>
        <div id="subtotal">
          <h3>Cart totals</h3>
          <table>
            <tbody>
              <tr>
                <td>Cart subtotal</td>
                <td>${cartTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>Free</td>
              </tr>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>${cartTotal.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          <button className="normal" onClick={() => navigate('/checkout')}>
  Proceed to checkout
</button>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  )
}