
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../services/project.service.js";

// Create a project
export const createProjectController = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await createProject(
      name,
      description,
      status,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects belonging to the logged-in user
export const getAllProjectsController = async (req, res, next) => {
  try {
    const projects = await getAllProjects(req.user.id);

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single project
export const getProjectByIdController = async (req, res, next) => {
  try {
    const project = await getProjectById(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};



 // Update a project
export const updateProjectController = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const project = await updateProject(
      req.params.id,
      name,
      description,
      status,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a project
export const deleteProjectController = async (req, res, next) => {
  try {
    await deleteProject(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
