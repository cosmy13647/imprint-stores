import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ id, brand, name, price, images, image }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  // handle both local data format and DB format
  const imgSrc = images
    ? (Array.isArray(images) ? images[0] : JSON.parse(images)[0])
    : image

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ id, brand, name, price, image: imgSrc })
  }

  return (
    <div className="pro" onClick={() => navigate(`/shop/${id}`)}>
      <img src={`/img/${imgSrc}`} alt={name} />
      <div className="des">
        <span>{brand}</span>
        <h5>{name}</h5>
        <div className="star">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
        <h4>${price}</h4>
      </div>
      <a href="#" onClick={handleAddToCart}>
        <i className="fa fa-shopping-cart"></i>
      </a>
    </div>
  )
}