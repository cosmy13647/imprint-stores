import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsletterSection from '../components/NewsletterSection'
import ProductGrid from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import api from '../services/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [mainImg, setMainImg]   = useState('')
  const [quantity, setQuantity] = useState(1)
  const [size, setSize]         = useState('')
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data
        setProduct(p)
        const imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]')
        setMainImg(imgs[0] || '')
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))

    api.get('/products')
      .then(res => setRelated(res.data.filter(p => p.id !== id).slice(0, 4)))
      .catch(() => {})
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    const imgs = Array.isArray(product.images)
      ? product.images
      : JSON.parse(product.images || '[]')
    addToCart({ ...product, image: imgs[0] }, quantity, size)
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="section-p1"><p>Loading product...</p></div>
      <Footer />
    </>
  )

  if (error || !product) return (
    <>
      <Navbar />
      <div className="section-p1">
        <h2>Product not found</h2>
        <button className="normal" onClick={() => navigate('/shop')}>Back to shop</button>
      </div>
      <Footer />
    </>
  )

  const images = Array.isArray(product.images)
    ? product.images
    : JSON.parse(product.images || '[]')

  return (
    <>
      <Navbar />

      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img
            src={`/img/${mainImg}`}
            width="100%"
            id="MainImg"
            alt={product.name}
          />
          <div className="small-img-group">
            {images.map((img, i) => (
              <div className="small-img-col" key={i}>
                <img
                  className="small-img"
                  width="100%"
                  src={`/img/${img}`}
                  alt=""
                  onClick={() => setMainImg(img)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="single-pro-details">
          <h6>Home / {product.category_name}</h6>
          <h4>{product.name}</h4>
          <h2>${product.price}</h2>

          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Select size</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="Large">Large</option>
            <option value="Small">Small</option>
          </select>

          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (!isNaN(val)) setQuantity(val)
            }}
          />

          <button className="normal" onClick={handleAddToCart}>Add to cart</button>

          <h4>Product details</h4>
          <span>{product.description}</span>
        </div>
      </section>

      {related.length > 0 && (
        <ProductGrid
          title="Related Products"
          subtitle=""
          products={related}
        />
      )}

      <NewsletterSection />
      <Footer />
    </>
  )
}