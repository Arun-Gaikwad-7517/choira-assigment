
import { body, param } from "express-validator";

// Validate project creation
export const createProjectValidator = [
  body("name")
    .isString()
    .withMessage("Project name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 150 })
    .withMessage("Project name cannot exceed 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["active", "completed", "archived"])
    .withMessage("Status must be active, completed, or archived"),
];

// Validate project ID in URL
export const projectIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Project ID must be a positive integer"),
];

// Validate project updates
export const updateProjectValidator = [
  ...projectIdValidator,

  body("name")
    .isString()
    .withMessage("Project name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ max: 150 })
    .withMessage("Project name cannot exceed 150 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .isIn(["active", "completed", "archived"])
    .withMessage("Status must be active, completed, or archived"),
];
