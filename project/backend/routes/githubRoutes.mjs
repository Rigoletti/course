import express from "express";
import * as authController from "../controllers/authController.mjs";
import { githubAuth, githubCallback } from "../controllers/githubController.mjs";

const router = express.Router();

router.post("/complete-github-registration", authController.completeGithubRegistration);
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

export default router;