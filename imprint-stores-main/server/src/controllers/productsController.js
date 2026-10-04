import pool from '../config/db.js'

export async function getProducts(req, res) {
  try {
    const { category, search } = req.query

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `
    const params = []

    if (category) {
      params.push(category)
      query += ` AND c.slug = $${params.length}`
    }

    if (search) {
      params.push(`%${search}%`)
      query += ` AND (p.name ILIKE $${params.length} OR p.brand ILIKE $${params.length})`
    }

    query += ' ORDER BY p.created_at DESC'

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export async function getProduct(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND p.is_active = true`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}export async function getAllProducts(req, res) {
  try {
    
    const result = await pool.query(
     `SELECT * FROM products ORDER BY created_at DESC`
      
    )
   
    res.json(result.rows)
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
export async function createProduct(req, res) {
  try {
    const { name, brand, price, description, image } = req.body

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const result = await pool.query(
      `INSERT INTO products (name, slug, brand, price, description, images)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, slug, brand, price, description, JSON.stringify([image])]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Create product error:', err)
    res.status(500).json({ error: 'Failed to create product' })
  }
}
export async function deleteProduct(req, res) {
  try {
    await pool.query(
      `UPDATE products SET is_active = false WHERE id = $1`,
      [req.params.id]
    )
    res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
}