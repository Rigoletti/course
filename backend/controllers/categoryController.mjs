import Category from "../models/Category.mjs";

// Получить все категории
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Создать новую категорию
export const createCategory = async (req, res) => {
    const { title, icon, services, link, subtopics } = req.body;
    try {
        const newCategory = new Category({
            title,
            icon,
            services,
            link,
            subtopics
        });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Получить категорию по ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Обновить категорию
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Удалить категорию
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fetchCategories = async () => {
    try {
        const response = await axios.get("/api/categories");
        console.log("Ответ от бэкенда:", response); 
        if (Array.isArray(response.data)) {
            setCategories(response.data);
        } else {
            console.error("Ошибка: данные не являются массивом", response.data);
        }
    } catch (error) {
        console.error("Ошибка при получении категорий:", error);
    }
};

export const updateSubtopicOrders = async (req, res) => {
    const { categoryId, subtopicName } = req.params;

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        const subtopic = category.subtopics.find(sub => sub.name === subtopicName);
        if (!subtopic) {
            return res.status(404).json({ message: "Подраздел не найден" });
        }

        subtopic.orders += 1;
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};