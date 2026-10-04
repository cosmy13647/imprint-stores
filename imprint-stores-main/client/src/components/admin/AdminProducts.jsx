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
      .catch(() => setError('Failed to load phones'))
      .finally(() => setLoading(false))
  }, [])
 
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const createProduct = async () => {
  try {
    const response = await api.post('/products/admin/create', {
      name: formData.name,
      brand: formData.brand,
      price: formData.price,
      description: formData.description,
      image: formData.image  // image filename in /public/img (e.g. "phone-name.jpg") or a full image URL
    })
    setProducts(prev => [...prev, response.data])
    console.log('Product created:', response.data)
  } catch (error) {
    console.error('Error creating phone:', error)
    alert('Could not add this phone. Please check the details and try again.')
  }
}
const deleteProduct = async (id) => {
  if (!window.confirm('Delete this phone listing?')) return
  try {
    await api.delete(`/products/admin/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  } catch {
    alert('Could not delete this phone')
  }
}




    return (
    <div>
        
        
       <form className="admin-form" onSubmit={(e) => { e.preventDefault(); createProduct(); }}>
  {/* Product Name */}
  <label htmlFor="name">Phone name</label>
  <input
    type="text"
    id="name"
    name="name"
    placeholder="Model and storage"
    onChange={handleChange}
  />

  {/* Brand */}
  <label htmlFor="brand">Brand</label>
  <input
    type="text"
    id="brand"
    name="brand"
    placeholder="e.g. Samsung"
    onChange={handleChange}
  />

  {/* Price */}
  <label htmlFor="price">Price (KSh)</label>
  <input
    type="number"
    id="price"
    name="price"
    placeholder="Price in KSh"
    min="0"
    step="0.01"
    onChange={handleChange}
  />

  {/* Image */}
  <label htmlFor="image">Image file name or URL</label>
 <input
  type="text"
  id="image"
  name="image"
  placeholder="e.g. phone-name.jpg or https://..."
  onChange={handleChange}
/> 

  {/* Description */}
  <label htmlFor="description">Description</label>
  <textarea
    id="description"
    name="description"
    placeholder="Condition, storage, battery health, any marks"
    rows="4"
    onChange={handleChange}
  ></textarea>

  <button  type="submit">Add phone</button>
</form>
   <h3 style={{ marginTop: '30px' }}>All phones</h3>

{loading && <p>Loading phones...</p>}
{error && <p style={{ color: 'red' }}>{error}</p>}

<table className="admin-table">
  <thead>
    <tr>
      <td>Image</td>
      <td>Phone</td>
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
            src={(() => {
              const first = Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images || '[]')[0]
              return first?.startsWith('http') ? first : `/img/${first}`
            })()}
            width="60px"
            alt={product.name}
          />
        </td>
        <td>{product.name}</td>
        <td>{product.brand}</td>
        <td>KSh {Number(product.price || 0).toLocaleString('en-KE')}</td>
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