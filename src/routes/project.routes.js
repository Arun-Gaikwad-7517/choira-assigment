
import express from "express";
import validateMiddleware from "../middleware/validate.middleware.js";
import {
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator,
} from "../validators/project.validator.js";


import {
  createProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

router.post(
  "/",
  createProjectValidator,
  validateMiddleware,
  createProjectController
);

router.get("/", getAllProjectsController);

router.get(
  "/:id",
  projectIdValidator,
  validateMiddleware,
  getProjectByIdController
);

router.put(
  "/:id",
  updateProjectValidator,
  validateMiddleware,
  updateProjectController
);

router.delete(
  "/:id",
  projectIdValidator,
  validateMiddleware,
  deleteProjectController
);


export default router;
