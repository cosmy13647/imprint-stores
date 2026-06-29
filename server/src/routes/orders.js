import { Router } from 'express'
import { createOrder, getOrders, getOrder, getAllOrders ,updateOrderStatus } from '../controllers/ordersController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
const router = Router()

router.post('/',   requireAuth, createOrder)
router.get('/',    requireAuth, getOrders)
router.get('/:id', requireAuth, getOrder)
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus)
router.get('/admin/all', requireAuth, requireAdmin, getAllOrders)
export default router