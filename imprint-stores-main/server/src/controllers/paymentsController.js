import pool from '../config/db.js'
import { initiateSTKPush } from '../services/mpesa.js'

export async function initiatePay(req, res) {
  try {
    const { orderId, phone } = req.body

    if (!orderId || !phone) {
      return res.status(400).json({ error: 'orderId and phone are required' })
    }

    // Verify order belongs to user and is pending
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [orderId, req.user.id]
    )
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const order = orderResult.rows[0]
    if (order.status === 'paid') {
      return res.status(400).json({ error: 'Order already paid' })
    }

    // Initiate STK push
    const stkResponse = await initiateSTKPush({
      phone,
      amount: order.total_amount,
      orderId: order.id
    })

    // Save payment record
    await pool.query(
      `INSERT INTO payments (order_id, phone_number, amount, mpesa_checkout_id, status)
       VALUES ($1, $2, $3, $4, 'pending')`,
      [order.id, phone, order.total_amount, stkResponse.CheckoutRequestID]
    )

    res.json({
      message:           'STK push sent. Check your phone.',
      checkoutRequestId: stkResponse.CheckoutRequestID
    })
  } catch (err) {
    console.error('Initiate pay error:', err.response?.data || err.message)
    res.status(500).json({ error: 'Failed to initiate payment' })
  }
}

export async function mpesaCallback(req, res) {
  // Respond to Safaricom IMMEDIATELY
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  try {
    const { Body: { stkCallback } } = req.body
    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback

    if (ResultCode !== 0) {
      // Payment failed or cancelled by user
      await pool.query(
        `UPDATE payments SET status = 'failed' WHERE mpesa_checkout_id = $1`,
        [CheckoutRequestID]
      )
      await pool.query(
        `UPDATE orders SET status = 'cancelled'
         WHERE id = (SELECT order_id FROM payments WHERE mpesa_checkout_id = $1)`,
        [CheckoutRequestID]
      )
      return
    }

    // Extract metadata from callback
    const meta = Object.fromEntries(
      CallbackMetadata.Item.map(i => [i.Name, i.Value])
    )
    const receipt = meta.MpesaReceiptNumber
    const amount  = meta.Amount

    // Use DB transaction — all updates succeed or all roll back
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Update payment
      await client.query(
        `UPDATE payments
         SET status = 'completed', mpesa_receipt = $1, confirmed_at = NOW()
         WHERE mpesa_checkout_id = $2`,
        [receipt, CheckoutRequestID]
      )

      // Update order status
      const { rows } = await client.query(
        `UPDATE orders SET status = 'paid'
         WHERE id = (SELECT order_id FROM payments WHERE mpesa_checkout_id = $1)
         RETURNING id`,
        [CheckoutRequestID]
      )

      // Decrement stock
      await client.query(
        `UPDATE products p
         SET stock = stock - oi.quantity
         FROM order_items oi
         WHERE oi.order_id = $1 AND oi.product_id = p.id`,
        [rows[0].id]
      )

      await client.query('COMMIT')
      console.log(`Payment confirmed: ${receipt} for order ${rows[0].id}`)
    } catch (err) {
      await client.query('ROLLBACK')
      console.error('Callback transaction failed:', err)
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Callback processing error:', err)
  }
}

export async function getPaymentStatus(req, res) {
  try {
    const { orderId } = req.params
    const result = await pool.query(
      `SELECT o.status as order_status, p.status as payment_status,
              p.mpesa_receipt, p.confirmed_at, p.amount
       FROM orders o
       LEFT JOIN payments p ON p.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2
       ORDER BY p.initiated_at DESC
       LIMIT 1`,
      [orderId, req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Get payment status error:', err)
    res.status(500).json({ error: 'Failed to get payment status' })
  }
}
export async function getAllPayments(req, res) {
  try {
    const result = await pool.query(
      `SELECT o.id as order_id, o.status as order_status, p.status as payment_status,
              p.mpesa_receipt, p.confirmed_at, p.amount
       FROM orders o
       LEFT JOIN payments p ON p.order_id = o.id
       
       ORDER BY p.initiated_at DESC`,
      
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Get all payments error:', err)
    res.status(500).json({ error: 'Failed to get all payments' })
  }
}