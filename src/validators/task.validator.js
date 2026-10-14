
import { body, param, query } from "express-validator";

// Validate task creation
export const createTaskValidator = [
  body("title")
    .isString()
    .withMessage("Task title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 200 })
    .withMessage("Task title cannot exceed 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .isInt({ min: 1 })
    .withMessage("Project ID must be a positive integer"),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),
];

// Validate MongoDB task ID
export const taskIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task ID"),
];

// Validate task updates
export const updateTaskValidator = [
  ...taskIdValidator,

  body("title")
    .optional()
    .isString()
    .withMessage("Task title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Task title cannot exceed 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("projectId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Project ID must be a positive integer"),

  body("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Invalid task status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid task priority"),
];

// Validate task listing filters and pagination
export const getTasksValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["todo", "in_progress", "completed"])
    .withMessage("Invalid task status filter"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority filter"),

  query("projectId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Project ID must be a positive integer"),
];
