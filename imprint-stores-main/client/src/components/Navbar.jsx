import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'

const WHATSAPP = 'https://wa.me/254112802314'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <section id="header">
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <img width="190" src="/cosmy-logo.svg" className="logo" alt="Cosmy Flagships" />
      </Link>

      <div>
        <ul id="navbar" className={menuOpen ? 'active' : ''}>
          <li><Link className={isActive('/')} to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link className={isActive('/shop')} to="/shop" onClick={() => setMenuOpen(false)}>Phones</Link></li>
          <li><a href={WHATSAPP} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>WhatsApp</a></li>
          {user ? (
            <>
              <li><span className="nav-user">Hi, {user.email.split('@')[0]}</span></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); handleLogout() }}>Log out</a></li>
            </>
          ) : (
            <li><Link className={isActive('/login')} to="/login" onClick={() => setMenuOpen(false)}>Log in</Link></li>
          )}
          <li>
            <Link to="/cart" aria-label="Cart" onClick={() => setMenuOpen(false)}>
              <i className="fa fa-shopping-basket" aria-hidden="true"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>

      <div id="mobile">
        <i id="bar" className="fas fa-outdent" role="button" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}></i>
        <a href={WHATSAPP} target="_blank" rel="noreferrer" aria-label="WhatsApp">
          <i className="fab fa-whatsapp"></i>
        </a>
        <Link to="/cart" aria-label="Cart">
          <i className="fa fa-shopping-basket" aria-hidden="true"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </section>
  )
}
