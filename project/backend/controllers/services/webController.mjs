import Order from '../../models/services/webOrder.mjs';
import User from '../../models/User.mjs';

// Создание заказа (доступно только админу)
export const createOrder = async (req, res) => {
    try {
      const { title, daysLeft, description, skills, price } = req.body;
  
      if (!req.user || !req.user._id) {
        return res.status(403).json({ message: 'Доступ запрещен. Пользователь не авторизован.' });
      }
  
      const newOrder = new Order({
        title,
        daysLeft,
        description,
        skills,
        price,
        createdBy: req.user._id, 
      });
  
      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Получение всех заказов (доступно всем)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('createdBy', 'username email'); // Добавляем информацию о создателе
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение одного заказа по ID (доступно всем)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('createdBy', 'username email');
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление заказа (доступно только админу)
export const updateOrder = async (req, res) => {
  try {
    const { title, daysLeft, description, skills, price } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    order.title = title || order.title;
    order.daysLeft = daysLeft || order.daysLeft;
    order.description = description || order.description;
    order.skills = skills || order.skills;
    order.price = price || order.price;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Удаление заказа (доступно только админу)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    await order.remove();
    res.json({ message: 'Заказ успешно удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};