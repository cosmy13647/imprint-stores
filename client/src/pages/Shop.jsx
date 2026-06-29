import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsletterSection from '../components/NewsletterSection'
import ProductGrid from '../components/ProductGrid'
import api from '../services/api'

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />

      <section id="page-header">
        <h2>#Stay Home</h2>
        <p>Save more with coupons & up to 70% off!</p>
      </section>

      {loading && <div className="section-p1"><p>Loading products...</p></div>}
      {error   && <div className="section-p1"><p style={{ color: 'red' }}>{error}</p></div>}

      {!loading && !error && (
        <ProductGrid title="" subtitle="" products={products} />
      )}

      <section id="pagination" className="section-p1">
        <a href="#">1</a>
        <a href="#">2</a>
        <a href="#"><i className="fa fa-long-arrow-alt-right"></i></a>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  )
}