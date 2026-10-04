export default function NewsletterSection() {
  return (
    <section id="newsletter" className="section-p1 section-m1">
      <div className="newstext">
        <h4>Get new-arrival updates</h4>
        <p>Be the first to hear when new flagship phones arrive, plus <span>special offers</span>.</p>
      </div>
      <div className="form">
        <input type="email" placeholder="Your email address" aria-label="Email address" />
        <button className="normal">Sign up</button>
      </div>
    </section>
  )
}
