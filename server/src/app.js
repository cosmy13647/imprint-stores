import dotenv from 'dotenv'
dotenv.config()
import paymentsRouter from './routes/payments.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import pool from './config/db.js'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/payments', paymentsRouter)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Imprint API running' })
})

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM products')
    res.json({ products: result.rows[0].count })
  } catch (err) {
    console.error('DB TEST ERROR:', err)
    res.status(500).json({ error: err.message })
  }
})

app.use('/api/auth',     authRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders',   ordersRouter)

app.use(errorHandler)

export default app