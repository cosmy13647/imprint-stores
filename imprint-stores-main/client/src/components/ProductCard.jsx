import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ id, brand, name, price, images, image }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  let imgSrc = image || ''
  if (images) {
    try {
      const parsed = Array.isArray(images) ? images : JSON.parse(images)
      imgSrc = parsed?.[0] || imgSrc
    } catch {}
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, brand, name, price, image: imgSrc })
  }

  const imageSrc = imgSrc.startsWith('http') ? imgSrc : `/img/${imgSrc}`

  return (
    <div className="pro" onClick={() => navigate(`/shop/${id}`)}>
      <div className="phone-image-wrap">
        <img src={imageSrc} alt={name} />
      </div>
      <div className="des">
        <span>{brand}</span>
        <h5>{name}</h5>
        <p className="condition-label">Ex-UK flagship • Availability confirmed before purchase</p>
        <h4>KSh {Number(price || 0).toLocaleString('en-KE')}</h4>
      </div>
      <button className="cart-btn" onClick={handleAddToCart} aria-label={`Add ${name} to cart`} title="Add to cart">
        <i className="fa fa-shopping-cart"></i>
      </button>
    </div>
  )
}
