import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, phone)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || "We couldn't create your account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <section id="page-header" className="phone-page-header">
        <p className="eyebrow">COSMY FLAGSHIPS</p>
        <h2>Create an account</h2>
        <p>Create your Cosmy Flagships account.</p>
      </section>

      <section id="login-form" className="section-p1">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {error && (
            <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="text"
                placeholder="Phone number (e.g. 0712 345 678)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '10px' }}
              />
            </div>
            <button className="normal" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p style={{ marginTop: '15px' }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>

      <Footer />
    </>
  )
}