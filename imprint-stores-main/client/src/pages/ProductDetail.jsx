import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductGrid from '../components/ProductGrid'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const WHATSAPP = 'https://wa.me/254112802314'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [mainImg, setMainImg] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data
        setProduct(p)
        const imgs = Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]')
        setMainImg(imgs[0] || '')
      })
      .catch(() => setError('Phone not found'))
      .finally(() => setLoading(false))

    api.get('/products')
      .then(res => setRelated(res.data.filter(p => String(p.id) !== String(id)).slice(0, 4)))
      .catch(() => {})
  }, [id])

  if (loading) return <><Navbar /><div className="section-p1"><p className="dark-text">Loading phone...</p></div><Footer /></>
  if (error || !product) return <><Navbar /><div className="section-p1"><h2>Phone not found</h2><p className="dark-text" style={{ margin: '10px 0 20px' }}>This phone may have been sold or removed.</p><button className="normal" onClick={() => navigate('/shop')}>Back to phones</button></div><Footer /></>

  const images = Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]')
  const imageSrc = mainImg?.startsWith('http') ? mainImg : `/img/${mainImg}`

  const handleAddToCart = () => {
    addToCart({ ...product, image: images[0] || '' }, quantity)
  }

  const price = Number(product.price || 0).toLocaleString('en-KE')

  return (
    <>
      <Navbar />
      <section id="prodetails" className="section-p1 phone-detail">
        <div className="single-pro-image">
          <img src={imageSrc} width="100%" id="MainImg" alt={product.name} />
          <div className="small-img-group">
            {images.map((img, i) => (
              <div className="small-img-col" key={i}>
                <img className="small-img" width="100%" src={img?.startsWith('http') ? img : `/img/${img}`} alt="" onClick={() => setMainImg(img)} />
              </div>
            ))}
          </div>
        </div>

        <div className="single-pro-details">
          <p className="eyebrow">{product.brand || 'FLAGSHIP PHONE'}</p>
          <h4>{product.name}</h4>
          <h2>KSh {price}</h2>
          <div className="phone-facts">
            <span>🇬🇧 Ex-UK</span>
            <span>✓ Condition checked</span>
            <span>📍 Eldoret</span>
          </div>
          <p className="dark-text">Availability and exact condition are confirmed before purchase. Ask us for current battery health, storage and any cosmetic marks.</p>

          <div className="quantity-row">
            <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
            <button className="normal" onClick={handleAddToCart}>Add to cart</button>
          </div>

          <a className="whatsapp-button" href={`${WHATSAPP}?text=${encodeURIComponent(`Hi Cosmy Flagships, I'm interested in the ${product.name}. Is it still available?`)}`} target="_blank" rel="noreferrer">
            <i className="fab fa-whatsapp"></i> Ask on WhatsApp
          </a>

          <h4>About this phone</h4>
          <span className="dark-text">{product.description || 'Ask us about this phone\'s current condition, battery health and availability.'}</span>
        </div>
      </section>

      {related.length > 0 && <ProductGrid title="You may also like" subtitle="" products={related} />}
      <Footer />
    </>
  )
}
