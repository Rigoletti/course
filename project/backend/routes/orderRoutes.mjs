// routes/orderRoutes.mjs
import express from 'express';
import { 
  // Основные операции с заказами
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCategory,
  
  // Операции с заявками на заказы
  createOrderRequest,
  getOrderRequests,
  approveOrderRequest,
  rejectOrderRequest
} from '../controllers/orderController.mjs';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// ======================================
// Публичные маршруты (не требуют авторизации)
// ======================================
router.get('/', getOrders); // Получить список заказов
router.get('/category/:categoryId', getOrdersByCategory); // Заказы по категории
router.get('/:id', getOrderById); // Получить заказ по ID

// ======================================
// Защищенные маршруты для обычных пользователей
// (требуют авторизации)
// ======================================
router.post('/requests', authMiddleware, createOrderRequest); // Создать заявку на заказ

// ======================================
// Защищенные маршруты для администраторов
// (требуют авторизации и прав администратора)
// ======================================

// Основные операции с заказами
router.post('/', authMiddleware, isAdmin, createOrder); // Создать заказ (админ)
router.put('/:id', authMiddleware, isAdmin, updateOrder); // Обновить заказ
router.delete('/:id', authMiddleware, isAdmin, deleteOrder); // Удалить заказ

// Управление заявками
router.get('/admin/requests', authMiddleware, isAdmin, getOrderRequests); // Получить список заявок
router.put('/admin/requests/:id/approve', authMiddleware, isAdmin, approveOrderRequest); // Одобрить заявку
router.put('/admin/requests/:id/reject', authMiddleware, isAdmin, rejectOrderRequest); // Отклонить заявку

export default router;