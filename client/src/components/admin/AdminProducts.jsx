import React from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";



export default function AdminProducts() {
    const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
 
  const [error, setError] = useState('')
   const [formData, setFormData] = useState({
  name: "",
  brand: "",
  price: "",
  description: "",
  image: null,
});
  useEffect(() => {
    api.get('/products/admin/all')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])
 
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleImageChange = (e) => {
  setFormData({
    ...formData,
    image: e.target.files[0],
  });
};
const createProduct = async () => {
  try {
    const response = await api.post('/products/admin/create', {
      name: formData.name,
      brand: formData.brand,
      price: formData.price,
      description: formData.description,
      image: formData.image  // just the filename e.g. "cartoon_shirt.jpg"
    })
    setProducts(prev => [...prev, response.data])
    console.log('Product created:', response.data)
  } catch (error) {
    console.error('Error creating product:', error)
  }
}
const deleteProduct = async (id) => {
  if (!window.confirm('Are you sure?')) return
  try {
    await api.delete(`/products/admin/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  } catch (err) {
    alert('Failed to delete product')
  }
}




    return (
    <div>
        
        
       <form className="admin-form" onSubmit={(e) => { e.preventDefault(); createProduct(); }}>
  {/* Product Name */}
  <label htmlFor="name">Product Name</label>
  <input
    type="text"
    id="name"
    name="name"
    placeholder="Enter product name"
    onChange={handleChange}
  />

  {/* Brand */}
  <label htmlFor="brand">Brand</label>
  <input
    type="text"
    id="brand"
    name="brand"
    placeholder="Enter brand"
    onChange={handleChange}
  />

  {/* Price */}
  <label htmlFor="price">Price</label>
  <input
    type="number"
    id="price"
    name="price"
    placeholder="Enter price"
    min="0"
    step="0.01"
    onChange={handleChange}
  />

  {/* Image */}
  <label htmlFor="image">Product Image</label>
 <input
  type="text"
  id="image"
  name="image"
  placeholder="e.g. cartoon_shirt.jpg"
  onChange={handleChange}
/> 

  {/* Description */}
  <label htmlFor="description">Description</label>
  <textarea
    id="description"
    name="description"
    placeholder="Describe the product"
    rows="4"
    onChange={handleChange}
  ></textarea>

  <button  type="submit">Add Product</button>
</form>
   <h3 style={{ marginTop: '30px' }}>All Products</h3>

{loading && <p>Loading products...</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}

<table className="admin-table">
  <thead>
    <tr>
      <td>Image</td>
      <td>Name</td>
      <td>Brand</td>
      <td>Price</td>
      <td>Stock</td>
      <td>Status</td>
      <td>Action</td>
    </tr>
  </thead>
  <tbody>
    {products.map(product => (
      <tr key={product.id}>
        <td>
          <img
            src={`/img/${Array.isArray(product.images)
              ? product.images[0]
              : JSON.parse(product.images || '[]')[0]}`}
            width="60px"
            alt={product.name}
          />
        </td>
        <td>{product.name}</td>
        <td>{product.brand}</td>
        <td>${product.price}</td>
        <td>{product.stock}</td>
        <td>{product.is_active ? 'Active' : 'Inactive'}</td>
        <td>
          <button
            onClick={() => deleteProduct(product.id)}
            className="btn-delete"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table> 
    
    
    </div>
  )

}