import { Router } from 'express'
import { getProducts, getProduct,getAllProducts ,createProduct,deleteProduct  } from '../controllers/productsController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
const router = Router()
router.get('/',           getProducts)      // public - active products only
router.get('/:id',        getProduct)       // public - single product
router.get('/admin/all',  requireAuth, requireAdmin, getAllProducts)  // admin - all including inactive
router.post('/admin/create',  requireAuth, requireAdmin, createProduct)  // admin - create new product
router.delete('/admin/:id', requireAuth, requireAdmin, deleteProduct)
export default router