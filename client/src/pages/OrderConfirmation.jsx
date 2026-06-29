import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'

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

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))

    return () => clearInterval(pollRef.current)
  }, [id])

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/payments/status/${id}`)
        if (res.data.order_status === 'paid') {
          clearInterval(pollRef.current)
          setOrder(prev => ({ ...prev, status: 'paid' }))
          setPayMsg(`Payment confirmed! Receipt: ${res.data.mpesa_receipt}`)
          setPaying(false)
        }
      } catch {}
    }, 3000)

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(pollRef.current)
      setPaying(false)
      if (order?.status !== 'paid') {
        setPayMsg('Payment not confirmed yet. Check your order history.')
      }
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
      setPayError(err.response?.data?.error || 'Payment failed')
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

  return (
    <>
      <Navbar />

      <section id="page-header">
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase</p>
      </section>

      <section className="section-p1" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
        <p>Status: <strong style={{ color: order.status === 'paid' ? '#088178' : '#f0ad4e' }}>
          {order.status.toUpperCase()}
        </strong></p>
        <p>Total: <strong>${order.total_amount}</strong></p>

        <h4 style={{ marginTop: '20px' }}>Items ordered</h4>
        <table width="100%">
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{item.product_name}</td>
                <td>x{item.quantity}</td>
                <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* M-Pesa payment section */}
        {order.status === 'pending' && (
          <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #088178', borderRadius: '8px' }}>
            <h3 style={{ color: '#088178' }}>Pay with M-Pesa</h3>
            <p>Enter your M-Pesa number to receive an STK push prompt on your phone.</p>

            {payMsg   && <p style={{ color: '#088178', fontWeight: 600 }}>{payMsg}</p>}
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
                {paying ? 'Waiting for payment...' : 'Pay Now'}
              </button>
            </form>
          </div>
        )}

        {order.status === 'paid' && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ color: '#088178', fontWeight: 600 }}>✓ Payment received successfully</p>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <button className="normal" onClick={() => navigate('/shop')}>
            Continue shopping
          </button>
        </div>
      </section>

      <Footer />
    </>
  )
}