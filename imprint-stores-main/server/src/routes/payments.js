import { Router } from 'express'
import { initiatePay, mpesaCallback, getPaymentStatus ,getAllPayments } from '../controllers/paymentsController.js'
import { requireAuth ,requireAdmin  } from '../middleware/auth.js'

const router = Router()

router.post('/mpesa/initiate',  requireAuth, initiatePay)
router.post('/mpesa/callback',  mpesaCallback)
router.get('/status/:orderId',  requireAuth, getPaymentStatus)
router.get('/admin/all', requireAuth, requireAdmin, getAllPayments)

export default router