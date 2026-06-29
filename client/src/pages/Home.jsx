import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsletterSection from '../components/NewsletterSection'
import ProductGrid from '../components/ProductGrid'
import api from '../services/api'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err))
  }, [])

  const featured = products.slice(0, 8)

  return (
    <>
      <Navbar />

      <section id="hero">
        <h4>Trade in offer</h4>
        <h2>Super value deals</h2>
        <h1>On all products</h1>
        <p>Save more with coupons & up to 70% off!</p>
        <button>Shop now</button>
      </section>

      <section id="feature" className="section-p1">
        <div className="fe-box">
          <img src="/img/free_shipping.jpg" width="120" height="120" alt="Free shipping" />
          <h6>Free shipping</h6>
        </div>
        <div className="fe-box">
          <img src="/img/online.jpg" width="120" height="120" alt="Online order" />
          <h6>Online order</h6>
        </div>
        <div className="fe-box">
          <img src="/img/save_money.jpg" width="120" height="120" alt="Save money" />
          <h6>Save money</h6>
        </div>
        <div className="fe-box">
          <img src="/img/promotions.jpg" width="120" height="120" alt="Promotions" />
          <h6>Promotions</h6>
        </div>
        <div className="fe-box">
          <img src="/img/happysell.jpg" width="120" height="120" alt="Happy sell" />
          <h6>Happy sell</h6>
        </div>
        <div className="fe-box">
          <img src="/img/support.jpg" width="120" height="120" alt="Support" />
          <h6>24/7 Support</h6>
        </div>
      </section>

      <ProductGrid
        title="Featured Products"
        subtitle="Summer Collection New Modern Design"
        products={featured}
      />

      <section id="banner" className="section-m1">
        <h4>Repair services</h4>
        <h2>Up to <span>70% off</span> - All T-Shirts & Accessories</h2>
        <button>Explore more</button>
      </section>

      <ProductGrid
        title="New Arrivals"
        subtitle="Summer Collection New Modern Design"
        products={featured}
      />

      <section id="sm-banner" className="section-p1">
        <div className="banner-box">
          <h4>Crazy deals</h4>
          <h2>Buy 1 get 1 Free</h2>
          <span>The best class boots is on sale at imprint</span>
          <button className="white">Learn more</button>
        </div>
        <div className="banner-box2">
          <h4>Spring/Summer</h4>
          <h2>Upcoming season</h2>
          <span>The best class boots is on sale at imprint</span>
          <button className="white">Collection</button>
        </div>
      </section>

      <section id="banner3">
        <div className="banner-box">
          <h2>SEASONAL SALE</h2>
          <h3>Winter collection -50% off</h3>
          <button className="white">Collection</button>
        </div>
        <div className="banner-box">
          <h2>SEASONAL SALE</h2>
          <h3>Winter collection -50% off</h3>
          <button className="white">Collection</button>
        </div>
        <div className="banner-box">
          <h2>SEASONAL SALE</h2>
          <h3>Winter collection -50% off</h3>
          <button className="white">Collection</button>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </>
  )
}