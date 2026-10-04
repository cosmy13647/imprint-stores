import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

const WHATSAPP = 'https://wa.me/254112802314'
const formatKsh = (value) => `KSh ${Number(value || 0).toLocaleString('en-KE')}`

export default function OrderConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [phone, setPhone]     = useState('')
  const [paying, setPaying]   = useState(false)
  const [payMsg, setPayMsg]   = useState('')
  const [payError, setPayError] = useState('')
  const pollRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))

    return () => {
      clearInterval(pollRef.current)
      clearTimeout(timeoutRef.current)
    }
  }, [id])

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/payments/status/${id}`)
        if (res.data.order_status === 'paid') {
          clearInterval(pollRef.current)
          clearTimeout(timeoutRef.current)
          setOrder(prev => ({ ...prev, status: 'paid' }))
          setPayMsg(`Payment confirmed! Receipt: ${res.data.mpesa_receipt}`)
          setPaying(false)
        }
      } catch {}
    }, 3000)

    // Stop polling after 2 minutes (cleared if the payment is confirmed first)
    timeoutRef.current = setTimeout(() => {
      clearInterval(pollRef.current)
      setPaying(false)
      setPayMsg("We haven't received your payment yet. If you've already paid, message us on WhatsApp with your M-Pesa receipt.")
    }, 120000)
  }

  const handlePay = async (e) => {
    e.preventDefault()
    setPaying(true)
    setPayError('')
    setPayMsg('')

    try {
      const res = await api.post('/payments/mpesa/initiate', {
        orderId: id,
        phone
      })
      setPayMsg(res.data.message)
      startPolling()
    } catch (err) {
      setPayError(err.response?.data?.error || "We couldn't start the M-Pesa payment. Please check your number and try again.")
      setPaying(false)
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="section-p1"><p>Loading order...</p></div>
      <Footer />
    </>
  )

  if (!order) return null

  return (
    <>
      <Navbar />

      <section id="page-header" className="phone-page-header">
        <p className="eyebrow">COSMY FLAGSHIPS</p>
        <h2>Order request received</h2>
        <p>Thank you. We'll confirm availability with you before the sale is final.</p>
      </section>

      <section className="section-p1" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
        <p>Status: <strong style={{ color: order.status === 'paid' ? '#168c4a' : '#f0ad4e' }}>
          {order.status.toUpperCase()}
        </strong></p>
        <p>Total: <strong>{formatKsh(order.total_amount)}</strong></p>

        <h4 style={{ marginTop: '20px' }}>Phones requested</h4>
        <table width="100%">
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.product_name}</td>
                <td>x{item.quantity}</td>
                <td>{formatKsh(item.unit_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* M-Pesa payment section */}
        {order.status === 'pending' && (
          <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #168c4a', borderRadius: '8px' }}>
            <h3 style={{ color: '#168c4a' }}>Pay with M-Pesa</h3>
            <p>Once we've confirmed your phone is available, enter your M-Pesa number to receive a payment prompt on your phone.</p>

            {payMsg   && <p style={{ color: '#168c4a', fontWeight: 600 }}>{payMsg}</p>}
            {payError && <p style={{ color: 'red' }}>{payError}</p>}

            <form onSubmit={handlePay} style={{ marginTop: '15px' }}>
              <input
                type="text"
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <button className="normal" type="submit" disabled={paying}>
                {paying ? 'Waiting for payment...' : 'Pay now'}
              </button>
            </form>
          </div>
        )}

        {order.status === 'paid' && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ color: '#168c4a', fontWeight: 600 }}>✓ Payment received. Thank you! We'll contact you to arrange handover.</p>
          </div>
        )}

        <p className="dark-text" style={{ marginTop: '24px' }}>
          Questions about your order? <a href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Cosmy Flagships, I have a question about my order #${order.id.slice(0, 8).toUpperCase()}.`)}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Message us on WhatsApp</a> (0112 802 314).
        </p>

        <div style={{ marginTop: '30px' }}>
          <button className="normal" onClick={() => navigate('/shop')}>
            Browse more phones
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}