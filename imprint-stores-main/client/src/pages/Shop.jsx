import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import api from '../services/api'

const WHATSAPP = 'https://wa.me/254112802314'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setError("We couldn't load the phones right now. Please refresh the page or try again shortly."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <section id="page-header" className="phone-page-header">
        <p className="eyebrow">COSMY FLAGSHIPS</p>
        <h2>Find your next flagship.</h2>
        <p>Samsung S21, S22, S23 and more.</p>
      </section>

      {loading && <div className="section-p1"><p className="dark-text">Loading phones...</p></div>}
      {error && <div className="section-p1"><p style={{ color: 'red' }}>{error}</p></div>}
      {!loading && !error && products.length > 0 && (
        <ProductGrid title="Phones" subtitle="Browse the phones we currently have available" products={products} />
      )}
      {!loading && !error && products.length === 0 && (
        <div className="section-p1">
          <h3>No phones are listed right now.</h3>
          <p className="dark-text" style={{ margin: '10px 0 20px' }}>New stock arrives regularly. Message us on WhatsApp with the model and budget you have in mind.</p>
          <a className="whatsapp-button" href={WHATSAPP} target="_blank" rel="noreferrer">
            <i className="fab fa-whatsapp"></i> Chat with us
          </a>
        </div>
      )}

      <Footer />
    </>
  )
}
