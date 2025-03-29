import express from "express";
import { 
    getCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    updateSubtopicOrders,
    getCategoryStats
} from "../controllers/categoryController.mjs";
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, isAdmin, createCategory); 
router.get("/:id", getCategoryById);
router.put("/:id", authMiddleware, isAdmin, updateCategory); 
router.get("/:id/stats", getCategoryStats);
router.put("/:categoryId/subtopics/:subtopicName/orders", updateSubtopicOrders);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);

export default router;