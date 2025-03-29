import express from 'express';
import { 
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCategory
} from '../controllers/orderController.mjs';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// Публичные endpoints
router.get('/', getOrders);
router.get('/category/:categoryId', getOrdersByCategory);
router.get('/:id', getOrderById);
// Защищенные endpoints
router.post('/', authMiddleware, isAdmin, createOrder);
router.put('/:id', authMiddleware, isAdmin, updateOrder);
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

export default router;