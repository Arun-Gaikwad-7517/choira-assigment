
import express from "express";

import {
  createTaskController,
  getAllTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator,
  getTasksValidator,
} from "../validators/task.validator.js";

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Create a task
router.post(
  "/",
  createTaskValidator,
  validateMiddleware,
  createTaskController
);

// Get tasks with pagination and filters
router.get(
  "/",
  getTasksValidator,
  validateMiddleware,
  getAllTasksController
);

// Get one task
router.get(
  "/:id",
  taskIdValidator,
  validateMiddleware,
  getTaskByIdController
);

// Update a task
router.put(
  "/:id",
  updateTaskValidator,
  validateMiddleware,
  updateTaskController
);

// Delete a task
router.delete(
  "/:id",
  taskIdValidator,
  validateMiddleware,
  deleteTaskController
);

export default router;
