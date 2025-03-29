import Order from '../models/Order.mjs';
import Category from '../models/Category.mjs';
import mongoose from 'mongoose';
import OrderRequest from '../models/OrderRequest.mjs';

// Создание заявки на заказ
export const createOrderRequest = async (req, res) => {
  try {
    const { title, description, skills = [], category, price, daysLeft } = req.body;

    // Валидация
    const errors = [];
    if (!title) errors.push('Не указано название');
    if (!description) errors.push('Не указано описание');
    if (!category) errors.push('Не указана категория');
    if (skills.length === 0) errors.push('Не указаны навыки');
    if (price === undefined || price === null) errors.push('Не указана цена');
    if (daysLeft === undefined || daysLeft === null) errors.push('Не указан срок выполнения');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ошибки валидации',
        errors: errors
      });
    }

    // Проверяем, что price и daysLeft - числа
    if (isNaN(price)) errors.push('Цена должна быть числом'); // Было if (isNaN(price) errors.push...
    if (isNaN(daysLeft)) errors.push('Срок выполнения должен быть числом');
   
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ошибки валидации',
        errors: errors
      });
    }

    // Проверяем авторизацию
    if (!req.user?._id) {
      return res.status(403).json({ 
        success: false,
        message: 'Доступ запрещен' 
      });
    }

    // Проверяем существование категории
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ 
        success: false,
        message: 'Категория не найдена' 
      });
    }

    // Создаем заявку
    const orderRequest = new OrderRequest({
      title,
      description,
      skills,
      category,
      price: Number(price),
      daysLeft: Number(daysLeft),
      createdBy: req.user._id,
      status: 'pending'
    });

    await orderRequest.save();

    res.status(201).json({
      success: true,
      data: orderRequest
    });

  } catch (error) {
    console.error('Error creating order request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании заявки на заказ',
      error: error.message
    });
  }
};

// Получение заявок (для админа)
export const getOrderRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const requests = await OrderRequest.find(query)
      .populate('createdBy', 'username email firstName lastName')
      .populate('category', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error getting order requests:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении заявок'
    });
  }
};

// Одобрение заявки (админ)
export const approveOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment, subtopic } = req.body;

    // Находим заявку
    const request = await OrderRequest.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('category', 'title services');

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Заявка не найдена' 
      });
    }

    // Определяем subtopic (из запроса или первого навыка)
    const finalSubtopic = subtopic || request.skills[0];
    if (!finalSubtopic) {
      return res.status(400).json({
        success: false,
        message: 'Не удалось определить подкатегорию (subtopic)'
      });
    }

    // Создаем заказ
    const order = new Order({
      title: request.title,
      description: request.description,
      skills: request.skills,
      price: request.price,
      daysLeft: request.daysLeft,
      createdBy: request.createdBy._id,
      category: request.category._id,
      subtopic: finalSubtopic,
      status: 'active'
    });

    await order.save();

    // Обновляем счетчик в категории
    await Category.updateOne(
      { _id: request.category._id, "subtopics.name": finalSubtopic },
      { $inc: { "subtopics.$.orders": 1 } },
      { upsert: true } // Создаем подкатегорию, если не существует
    );

    // Обновляем статус заявки
    await OrderRequest.findByIdAndUpdate(id, {
      status: 'approved',
      adminComment: adminComment || ''
    });

    res.status(200).json({
      success: true,
      data: {
        order: order,
        request: {
          ...request.toObject(),
          status: 'approved',
          adminComment: adminComment || ''
        }
      }
    });

  } catch (error) {
    console.error('Error approving order request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при одобрении заявки',
      error: error.message
    });
  }
};
// Отклонение заявки (админ)
export const rejectOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment } = req.body;

    const request = await OrderRequest.findByIdAndUpdate(
      id,
      { 
        status: 'rejected',
        adminComment: adminComment || '' 
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Заявка не найдена' 
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error rejecting order request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при отклонении заявки'
    });
  }
};

// Редактирование заявки (админ)
export const updateOrderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, skills, category, price, daysLeft } = req.body;

    const request = await OrderRequest.findById(id);
    if (!request) {
      return res.status(404).json({ 
        success: false,
        message: 'Заявка не найдена' 
      });
    }

    // Обновляем данные заявки
    request.title = title || request.title;
    request.description = description || request.description;
    request.skills = skills || request.skills;
    request.category = category || request.category;
    request.price = price || request.price;
    request.daysLeft = daysLeft || request.daysLeft;

    await request.save();

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error updating order request:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при обновлении заявки'
    });
  }
};

export const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComment, subtopic } = req.body;

    if (!subtopic) {
      return res.status(400).json({
        success: false,
        message: "Не указана подкатегория (subtopic)"
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        adminComment,
        subtopic,
        approvedAt: Date.now()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Заказ не найден"
      });
    }

    // Обновляем счетчик в категории
    await Category.updateOne(
      { _id: order.category, "subtopics.name": subtopic },
      { $inc: { "subtopics.$.orders": 1 } }
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error approving order:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при одобрении заказа',
      error: error.message
    });
  }
};


// Создание заказа (админ)
export const createOrder = async (req, res) => {
  try {
    const { title, daysLeft, description, skills = [], price, category, subtopic } = req.body;

    // Валидация
    if (!title || !daysLeft || !description || !price || !category || !subtopic) {
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
      category,
      subtopic // Добавляем subtopic
    });

    await order.save();
    
    // Обновляем счетчик в категории
    await Category.updateOne(
      { _id: category, "subtopics.name": subtopic },
      { $inc: { "subtopics.$.orders": 1 } },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при создании заказа',
      error: error.message
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
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Некорректный ID категории' 
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Категория не найдена' 
      });
    }

    const [total, orders] = await Promise.all([
      Order.countDocuments({ category: categoryId }),
      Order.find({ category: categoryId })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('createdBy', 'username email')
        .populate('category', 'title')
        .sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      orders,
      category: {
        title: category.title,
        icon: category.icon
      }
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
      .populate('createdBy', 'username email firstName lastName')
      .populate('category', 'title icon');
      
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Заказ не найден' 
      });
    }

    // Формируем данные клиента
    const clientData = {
      name: order.createdBy.firstName || 'Неизвестно',
      surname: order.createdBy.lastName || '',
      registeredAt: order.createdBy.createdAt || new Date(),
      rating: 4.5, 
      reviewsCount: 10 
    };

    res.json({ 
      success: true, 
      order: {
        ...order.toObject(),
        client: clientData
      } 
    });
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера',
      error: error.message 
    });
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

  // Для каждого навыка обновляем счетчик соответствующей подкатегории
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