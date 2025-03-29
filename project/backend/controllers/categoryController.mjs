import Category from "../models/Category.mjs";
import Order from "../models/Order.mjs";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from '../config/multerConfig.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadIcon = multer.single('icon');

export const getCategories = async (req, res) => {
    try {
        // Получаем все категории
        const categories = await Category.find().lean();
        
        // Получаем ВСЕ заказы с нужными полями
        const allOrders = await Order.find({}, 'category subtopic').lean();
        
        console.log('Total orders count:', allOrders.length);
        
        // Формируем результат с подсчетом заказов
        const categoriesWithOrders = categories.map(category => {
            // Фильтруем заказы для текущей категории
            const categoryOrders = allOrders.filter(order => 
                order.category && order.category.toString() === category._id.toString()
            );
            
            console.log(`Orders for category ${category.title}:`, categoryOrders.length);
            
            // Обновляем подкатегории с актуальным количеством заказов
            const subtopicsWithOrders = category.subtopics.map(subtopic => {
                // Ищем точное совпадение по имени подкатегории
                const count = categoryOrders.filter(order => 
                    order.subtopic && order.subtopic.trim().toLowerCase() === subtopic.name.trim().toLowerCase()
                ).length;
                
                console.log(`Orders for subtopic ${subtopic.name}:`, count);
                
                return {
                    name: subtopic.name,
                    orders: count
                };
            });
            
            return {
                ...category,
                subtopics: subtopicsWithOrders
            };
        });
        
        res.status(200).json(categoriesWithOrders);
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при получении категорий',
            error: error.message 
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { title, services = [] } = req.body;

        if (!title) {
            return res.status(400).json({ 
                success: false,
                message: 'Название категории обязательно'
            });
        }

        // Генерируем ссылку автоматически
        const link = `/category/${title.toLowerCase().replace(/\s+/g, '-')}`;

        // Создаем массив подтем на основе services
        const subtopics = services.map(service => ({
            name: service,
            orders: 0
        }));

        const newCategory = new Category({
            title,
            link,
            services,
            subtopics
        });

        await newCategory.save();
        res.status(201).json({
            success: true,
            data: newCategory
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Ошибка при создании категории',
            error: error.message
        });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: "Категория не найдена" 
            });
        }
        
        // Получаем количество заказов для каждого подраздела
        const ordersCount = await Promise.all(
            category.subtopics.map(async (subtopic) => {
                const count = await Order.countDocuments({
                    category: category._id,
                    subtopic: subtopic.name
                });
                return {
                    name: subtopic.name,
                    orders: count
                };
            })
        );
        
        const categoryWithOrders = {
            ...category.toObject(),
            subtopics: ordersCount
        };
        
        res.status(200).json({
            success: true,
            data: categoryWithOrders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при получении категории',
            error: error.message 
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
      const { title, link, services = [] } = req.body;
      
      // Проверка обязательных полей
      if (!title || !link) {
        return res.status(400).json({
          success: false,
          message: 'Название и ссылка категории обязательны',
          receivedData: req.body // Для отладки
        });
      }
  
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: "Категория не найдена" 
        });
      }
  
      // Сохраняем текущие счетчики заказов
      const existingOrders = {};
      category.subtopics.forEach(sub => {
        existingOrders[sub.name] = sub.orders;
      });
  
      // Обновляем данные
      category.title = title;
      category.link = link;
      category.services = services;
      
      // Обновляем подтемы, сохраняя счетчики
      category.subtopics = services.map(service => ({
        name: service,
        orders: existingOrders[service] || 0
      }));
  
      category.updatedAt = Date.now();
      await category.save();
      
      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(400).json({ 
        success: false,
        message: 'Ошибка при обновлении категории',
        error: error.message 
      });
    }
  };
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: "Категория не найдена" 
            });
        }

        await Order.deleteMany({ category: req.params.id });
        
        if (category.icon) {
            try {
                fs.unlinkSync(path.join(__dirname, '../uploads', category.icon));
            } catch (err) {
                console.error('Ошибка при удалении иконки:', err);
            }
        }
        
        await Category.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ 
            success: true,
            message: "Категория и связанные заказы успешно удалены" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при удалении категории',
            error: error.message 
        });
    }
};

export const updateSubtopicOrders = async (req, res) => {
    const { categoryId, subtopicName } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: "Категория не найдена" 
            });
        }

        const subtopic = category.subtopics.find(sub => sub.name === subtopicName);
        if (!subtopic) {
            return res.status(404).json({ 
                success: false,
                message: "Подраздел не найден" 
            });
        }

        subtopic.orders += 1;
        await category.save();

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при обновлении счетчика заказов',
            error: error.message 
        });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Общее количество заказов в категории
        const totalOrders = await Order.countDocuments({ category: categoryId });
        
        // Количество заказов по подразделам
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: "Категория не найдена" 
            });
        }
        
        const subtopicStats = await Promise.all(
            category.subtopics.map(async (subtopic) => {
                const count = await Order.countDocuments({
                    category: categoryId,
                    subtopic: subtopic.name
                });
                return {
                    name: subtopic.name,
                    orders: count
                };
            })
        );
        
        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                subtopics: subtopicStats
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при получении статистики',
            error: error.message 
        });
    }
};