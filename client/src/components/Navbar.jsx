import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'

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
      <Link to="/"><img width="70px" src="/img/032688086182d7bd44a8e76327ca5b70.jpg" className="logo" alt="logo" /></Link>
      <div>
        <ul id="navbar" className={menuOpen ? 'active' : ''}>
          <li><Link className={isActive('/')}     to="/">Home</Link></li>
          <li><Link className={isActive('/shop')} to="/shop">Shop</Link></li>
          <li><Link className={isActive('/blog')} to="/blog">Blog</Link></li>
          <li><Link className={isActive('/about')} to="/about">About</Link></li>
          <li><Link className={isActive('/contact')} to="/contact">Contact</Link></li>
          {user ? (
            <>
              <li>
                <span style={{
                  color: '#ffffff',
                  fontWeight: 600,
                  padding: '0 10px',
                  backgroundColor: '#088178',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  Hi, {user.email.split('@')[0]}
                </span>
              </li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout() }}>Logout</a></li>
            </>
          ) : (
            <>
              <li><Link className={isActive('/login')}    to="/login">Login</Link></li>
              <li><Link className={isActive('/register')} to="/register">Register</Link></li>
            </>
          )}
          <li>
            <Link to="/cart">
              <i className="fa fa-shopping-basket" aria-hidden="true"></i>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
      <div id="mobile">
        <i
          id="bar"
          className="fas fa-outdent"
          onClick={() => setMenuOpen(!menuOpen)}
        ></i>
        <Link to="/cart">
          <i className="fa fa-shopping-basket"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </section>
  )
}