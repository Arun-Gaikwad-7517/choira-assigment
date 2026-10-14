
import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validateMiddleware,
  register
);

router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  login
);

router.get("/me", authMiddleware, getProfile);

router.put(
  "/profile",
  authMiddleware,
  updateProfileValidator,
  validateMiddleware,
  updateProfile
);

export default router;
