import { Link } from 'react-router-dom'

const WHATSAPP = 'https://wa.me/254112802314'

export default function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <img className="logo" width="190" src="/cosmy-logo.svg" alt="Cosmy Flagships" />
        <h4>Contact</h4>
        <p><strong>Location:</strong> Eldoret, Kenya</p>
        <p><strong>WhatsApp:</strong> <a href={WHATSAPP} target="_blank" rel="noreferrer">0112 802 314</a></p>
        <p><strong>Hours:</strong> Mon–Sat, 8:00am–7:00pm</p>
        <div className="follow">
          <h4>Follow Cosmy Flagships</h4>
          <div className="icon">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-tiktok"></i>
            <i className="fab fa-whatsapp"></i>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>Cosmy Flagships</h4>
        <Link to="/shop">Shop phones</Link>
        <Link to="/cart">Cart</Link>
        <a href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
      </div>

      <div className="col">
        <h4>Buying with us</h4>
        <p>Ex-UK flagship phones</p>
        <p>Condition checked</p>
        <p>Local Eldoret handover</p>
        <p>Availability confirmed before purchase</p>
      </div>

      <div className="col">
        <h4>Need a phone?</h4>
        <p>Send your model and budget on WhatsApp.</p>
        <a className="whatsapp-button small" href={WHATSAPP} target="_blank" rel="noreferrer">Chat with us</a>
      </div>

      <div className="copyright">
        <p>© {new Date().getFullYear()} Cosmy Flagships • Eldoret, Kenya</p>
      </div>
    </footer>
  )
}
