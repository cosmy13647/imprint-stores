import pool from '../config/db.js'

export async function createOrder(req, res) {
  const client = await pool.connect()
  try {
    const { items, delivery_address } = req.body
    const user_id = req.user.id

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' })
    }

    await client.query('BEGIN')

    // Verify stock and calculate total server-side
    let total = 0
    for (const item of items) {
      const result = await client.query(
        'SELECT id, name, price, stock FROM products WHERE id = $1 AND is_active = true',
        [item.product_id]
      )
      if (result.rows.length === 0) {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: `Product not found: ${item.product_id}` })
      }
      const product = result.rows[0]
      if (product.stock < item.quantity) {
        await client.query('ROLLBACK')
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
      }
      total += parseFloat(product.price) * item.quantity
    }

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [user_id, total.toFixed(2), JSON.stringify(delivery_address || {})]
    )
    const order = orderResult.rows[0]

    // Insert order items
    for (const item of items) {
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      )
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, size)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.quantity, productResult.rows[0].price, item.size || null]
      )
    }

    await client.query('COMMIT')
    res.status(201).json(order)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to create order' })
  } finally {
    client.release()
  }
}

export async function getOrders(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        json_agg(json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'size', oi.size,
          'product_name', p.name,
          'product_image', p.images
        )) as items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}

export async function getOrder(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.*,
        json_agg(json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'size', oi.size,
          'product_name', p.name,
          'product_image', p.images
        )) as items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [req.params.id, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get order error:', err)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
}
export async function getAllOrders(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.*, u.email as user_email,
        json_agg(json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'size', oi.size,
          'product_name', p.name,
          'product_image', p.images
        )) as items
       FROM orders o
       LEFT JOIN users u ON u.id = o.user_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN products p ON p.id = oi.product_id
       GROUP BY o.id, u.email
       ORDER BY o.created_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Get all orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body
    const { id } = req.params

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error('Update order status error:', err)
    res.status(500).json({ error: 'Failed to update order status' })
  }
}