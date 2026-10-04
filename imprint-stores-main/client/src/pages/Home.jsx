import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import api from '../services/api'

const WHATSAPP = 'https://wa.me/254112802314'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err))
  }, [])

  const featured = products.slice(0, 8)

  return (
    <>
      <Navbar />

      <section id="hero">
        <div className="hero-content">
          <p className="eyebrow">ELDORET • KENYA</p>
          <h4>Premium phones. Real value.</h4>
          <h1>Samsung S21, S22, S23 & more.</h1>
          <p>Quality ex-UK flagship phones in Eldoret. Confirm the exact device, its condition and its availability before you buy.</p>
          <div className="hero-actions">
            <Link className="normal" to="/shop">View phones</Link>
            <a className="outline" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp 0112 802 314</a>
          </div>
        </div>
      </section>

      <section id="feature" className="section-p1">
        <div className="fe-box"><div className="feature-icon">✓</div><h6>Verified stock</h6><p>We confirm availability before you buy.</p></div>
        <div className="fe-box"><div className="feature-icon">📱</div><h6>Flagship phones</h6><p>Samsung and other premium devices.</p></div>
        <div className="fe-box"><div className="feature-icon">📍</div><h6>Eldoret based</h6><p>Local viewing and handover.</p></div>
        <div className="fe-box"><div className="feature-icon">💬</div><h6>Easy ordering</h6><p>Message us directly on WhatsApp.</p></div>
      </section>

      {featured.length > 0 && (
        <ProductGrid
          title="Available flagships"
          subtitle="Phones currently available at Cosmy Flagships"
          products={featured}
        />
      )}

      <section id="brand-banner" className="section-p1">
        <div>
          <p className="eyebrow">COSMY FLAGSHIPS</p>
          <h2>Looking for a clean S21, S22 or S23?</h2>
          <p>Tell us your budget and preferred model. We'll help you find the right device.</p>
          <a className="normal" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
        </div>
      </section>

      <section id="sm-banner" className="section-p1">
        <div className="simple-banner">
          <h4>Samsung</h4>
          <h2>S21 • S22 • S23</h2>
          <span>Storage options, conditions and prices vary.</span>
        </div>
        <div className="simple-banner">
          <h4>Need something else?</h4>
          <h2>Ask us.</h2>
          <span>Send us your budget and we'll check what's available.</span>
        </div>
      </section>

      <Footer />
    </>
  )
}
