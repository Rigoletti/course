import express from "express";
import passport from "passport";
import { githubAuth, githubCallback } from "../controllers/githubController.mjs";

const router = express.Router();

// Маршрут для перенаправления на GitHub
router.get("/github", githubAuth);

// Маршрут для обработки callback от GitHub
router.get("/github/callback", githubCallback);

export default router;