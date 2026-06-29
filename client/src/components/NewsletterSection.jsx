export default function NewsletterSection() {
  return (
    <section id="newsletter" className="section-p1 section-m1">
      <div className="newstext">
        <h4>Sign up for newsletters</h4>
        <p>Get email updates about our latest shop and <span>special offers</span></p>
      </div>
      <div className="form">
        <input type="text" placeholder="Your email address" />
        <button className="normal">Sign up</button>
      </div>
    </section>
  )
}