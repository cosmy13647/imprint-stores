import ProductCard from './ProductCard'

export default function ProductGrid({ title, subtitle, products }) {
  return (
    <section id="product1" className="section-p1">
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
      <div className="pro-container">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            brand={product.brand}
            name={product.name}
            price={product.price}
            images={product.images}
            image={product.image}
          />
        ))}
      </div>
    </section>
  )
}