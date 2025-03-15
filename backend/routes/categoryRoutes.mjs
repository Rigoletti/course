import express from "express";
import { getCategories,createCategory,getCategoryById,updateCategory,deleteCategory, updateSubtopicOrders} from "../controllers/categoryController.mjs";

const router = express.Router();


router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.put("/:categoryId/subtopics/:subtopicName/orders", updateSubtopicOrders);
router.delete("/:id", deleteCategory);

export default router;