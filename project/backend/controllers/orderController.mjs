import Order from '../models/Order.mjs';
import Category from '../models/Category.mjs';
import mongoose from 'mongoose';

// Создание заказа (админ)
export const createOrder = async (req, res) => {
  try {
    const { title, daysLeft, description, skills = [], price, category } = req.body;

    // Валидация
    if (!title || !daysLeft || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены'
      });
    }

    if (skills.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Максимум 5 навыков в заказе'
      });
    }

    if (!req.user?._id) {
      return res.status(403).json({ 
        success: false,
        message: 'Доступ запрещен' 
      });
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ 
        success: false,
        message: 'Категория не найдена' 
      });
    }

    const order = new Order({
      title,
      daysLeft,
      description,
      skills,
      price,
      createdBy: req.user._id,
      category
    });

    await order.save();
    
    // Обновляем счетчики навыков в категории
    await updateSkillsCount(category, skills, 'add');

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании заказа'
    });
  }
};
// Получение заказов с фильтрацией
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (category) {
      const categoryDoc = await Category.findOne({ link: category });
      if (!categoryDoc) {
        return res.status(404).json({ 
          success: false,
          message: 'Category not found'
        });
      }
      query.category = categoryDoc._id;
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'username email')
        .populate('category', 'title _id')  // Добавляем _id для надежности
        .sort({ createdAt: -1 })
        .lean()  // Преобразуем в обычные объекты
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      orders
    });

  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Получение заказов категории с пагинацией
export const getOrdersByCategory = async (req, res) => {
  console.log('Start getOrdersByCategory'); // Логирование
  try {
      const { categoryId } = req.params;
      console.log('Request params:', req.params); // Логирование
      
      // Простая проверка ID
      if (!categoryId) {
          console.log('No categoryId provided');
          return res.status(400).json({ 
              success: false, 
              message: 'ID категории обязателен' 
          });
      }

      // Проверяем существование категории
      const category = await Category.findById(categoryId).lean();
      if (!category) {
          console.log('Category not found');
          return res.status(404).json({ 
              success: false, 
              message: 'Категория не найдена' 
          });
      }

      // Получаем заказы без пагинации для простоты
      const orders = await Order.find({ category: categoryId })
          .populate('createdBy', 'username email')
          .populate('category', 'title icon')
          .sort({ createdAt: -1 })
          .lean();

      console.log(`Found ${orders.length} orders`); // Логирование

      res.status(200).json({
          success: true,
          category: {
              title: category.title,
              icon: category.icon
          },
          orders
      });

  } catch (error) {
      console.error('Error in getOrdersByCategory:', error);
      res.status(500).json({ 
          success: false, 
          message: 'Ошибка сервера',
          error: error.message 
      });
  }
};
// Получение заказа по ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('category', 'title icon');
      
    if (!order) {
      return res.status(404).json({ success: false, message: 'Заказ не найден' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновление заказа (админ)
export const updateOrder = async (req, res) => {
  try {
    const { skills = [], category: newCategoryId } = req.body;
    const orderId = req.params.id;

    if (skills.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Максимум 5 навыков в заказе'
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Заказ не найден' 
      });
    }

    const oldCategoryId = order.category;
    const categoryChanged = newCategoryId && newCategoryId !== oldCategoryId;

    // Уменьшаем счетчики в старой категории
    if (oldCategoryId && order.skills.length) {
      await updateSkillsCount(oldCategoryId, order.skills, 'remove');
    }

    // Обновляем данные заказа
    Object.assign(order, {
      title: req.body.title || order.title,
      daysLeft: req.body.daysLeft || order.daysLeft,
      description: req.body.description || order.description,
      skills,
      price: req.body.price || order.price,
      category: newCategoryId || order.category
    });

    await order.save();

    // Увеличиваем счетчики в новой категории
    const targetCategoryId = categoryChanged ? newCategoryId : oldCategoryId;
    if (targetCategoryId && skills.length) {
      await updateSkillsCount(targetCategoryId, skills, 'add');
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при обновлении заказа'
    });
  }
};

// Удаление заказа (админ)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Заказ не найден' 
      });
    }

    // Уменьшаем счетчики в категории
    if (order.skills.length) {
      await updateSkillsCount(order.category, order.skills, 'remove');
    }

    res.json({
      success: true,
      message: 'Заказ удален'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при удалении заказа'
    });
  }
};

// Вспомогательная функция для обновления счетчиков
async function updateCategoryCounters(order, { skills, category }) {
  try {
    const [oldCategory, newCategory] = await Promise.all([
      Category.findById(order.category),
      category ? Category.findById(category) : null
    ]);

    // Уменьшаем счетчики в старой категории
    if (oldCategory && order.skills?.length) {
      for (const skill of order.skills) {
        const subtopic = oldCategory.subtopics.find(s => s.name === skill);
        if (subtopic) {
          subtopic.orders -= 1;
          if (subtopic.orders <= 0) {
            oldCategory.subtopics.pull(subtopic);
          }
        }
      }
      await oldCategory.save();
    }

    // Увеличиваем счетчики в новой категории
    const targetCategory = newCategory || oldCategory;
    if (targetCategory && skills?.length) {
      for (const skill of skills) {
        const subtopic = targetCategory.subtopics.find(s => s.name === skill);
        if (subtopic) {
          subtopic.orders += 1;
        } else {
          // Добавляем новый навык в подтемы
          targetCategory.subtopics.push({ 
            name: skill, 
            orders: 1 
          });
        }
      }
      await targetCategory.save();
    }
  } catch (error) {
    console.error('Error in updateCategoryCounters:', error);
    throw error;
  }
}

const updateSkillsCount = async (categoryId, skills, action = 'add') => {
  const category = await Category.findById(categoryId);
  if (!category) return;

  for (const skill of skills) {
    const subtopic = category.subtopics.find(s => s.name === skill);
    
    if (subtopic) {
      subtopic.orders += (action === 'add' ? 1 : -1);
      if (subtopic.orders <= 0) {
        category.subtopics.pull(subtopic);
      }
    } else if (action === 'add') {
      category.subtopics.push({ name: skill, orders: 1 });
    }
  }

  await category.save();
};