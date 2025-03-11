import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../../controllers/services/webController.mjs';
import authMiddleware from '../../middleware/authMiddleware.mjs';
import { isAdmin } from '../../middleware/authMiddleware.mjs';

const router = express.Router();

// Создание заказа (доступно только админу)
router.post('/', authMiddleware, isAdmin, createOrder);

// Получение всех заказов (доступно всем)
router.get('/', getOrders);

// Получение одного заказа по ID (доступно всем)
router.get('/:id', getOrderById);

// Обновление заказа (доступно только админу)
router.put('/:id', authMiddleware, isAdmin, updateOrder);

// Удаление заказа (доступно только админу)
router.delete('/:id', authMiddleware, isAdmin, deleteOrder);

export default router;