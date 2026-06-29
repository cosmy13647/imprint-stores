import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" width="70px" src="/img/032688086182d7bd44a8e76327ca5b70.jpg" alt="logo" />
        <h4>Contact</h4>
        <p><strong>Address:</strong> 562 Wellington road, Street 32, San Francisco</p>
        <p><strong>Phone:</strong> +25494188299</p>
        <p><strong>Hours:</strong> 7:00am Monday to 7:00pm Saturday</p>
        <div className="follow">
          <h4>Follow us</h4>
          <div className="icon">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-pinterest"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>About</h4>
        <Link to="#">About us</Link>
        <Link to="#">Delivery information</Link>
        <Link to="#">Privacy policy</Link>
        <Link to="#">Terms and conditions</Link>
        <Link to="#">Contact us</Link>
      </div>

      <div className="col">
        <h4>My account</h4>
        <Link to="#">Sign in</Link>
        <Link to="/cart">View cart</Link>
        <Link to="#">My wishlist</Link>
        <Link to="#">Track my order</Link>
        <Link to="#">Help</Link>
      </div>

      <div className="col install">
        <h4>Install app</h4>
        <p>From Appstore or Google Play</p>
        <div className="row">
          <img width="150px" src="/img/277cef864011020560476a657581ea6f.jpg" alt="app stores" />
        </div>
        <p>Secure your payment gateway</p>
      </div>

      <div className="copyright">
        <p>2024, Cosmy Techs</p>
      </div>
    </footer>
  )
}