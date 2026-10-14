import Task from "../models/Task.js";
import pool from "../config/mysql.js";
import AppError from "../utils/AppError.js";

// Create a new project
export const createProject = async (
  name,
  description,
  status,
  userId
) => {
  const [result] = await pool.execute(
    `INSERT INTO projects (name, description, status, owner_id)
     VALUES (?, ?, ?, ?)`,
    [name.trim(), description || null, status || "active", userId]
  );

  const [projects] = await pool.execute(
    `SELECT id, name, description, status, owner_id, created_at, updated_at
     FROM projects
     WHERE id = ? AND owner_id = ?`,
    [result.insertId, userId]
  );

  return projects[0];
};

// Get all projects belonging to the logged-in user
export const getAllProjects = async (userId) => {
  const [projects] = await pool.execute(
    `SELECT id, name, description, status, owner_id, created_at, updated_at
     FROM projects
     WHERE owner_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return projects;
};

// Get one project belonging to the logged-in user
export const getProjectById = async (projectId, userId) => {
  const [projects] = await pool.execute(
    `SELECT id, name, description, status, owner_id, created_at, updated_at
     FROM projects
     WHERE id = ? AND owner_id = ?`,
    [projectId, userId]
  );

  if (projects.length === 0) {
    throw new AppError("Project not found", 404);
  }

  return projects[0];
};



 // Update a project
export const updateProject = async (
  projectId,
  name,
  description,
  status,
  userId
) => {
  // Check whether the project belongs to this user
  const [projects] = await pool.execute(
    "SELECT id FROM projects WHERE id = ? AND owner_id = ?",
    [projectId, userId]
  );

  if (projects.length === 0) {
    throw new AppError("Project not found", 404);
  }

  await pool.execute(
    `UPDATE projects
     SET name = ?, description = ?, status = ?
     WHERE id = ? AND owner_id = ?`,
    [name.trim(), description || null, status, projectId, userId]
  );

  return getProjectById(projectId, userId);
};

// Delete a project
export const deleteProject = async (projectId, userId) => {
  // Check that the project belongs to the logged-in user
  const project = await getProjectById(projectId, userId);

  // Find tasks that are not completed
  const pendingTaskExists = await Task.exists({
    projectId: Number(projectId),
    status: { $in: ["todo", "in_progress"] },
  });

  // Do not delete a project if it has any incomplete tasks
  if (pendingTaskExists) {
    throw new AppError(
      "Cannot delete project because some tasks are incomplete",
      409
    );
  }

  // Delete the project from MySQL
  await pool.execute(
    "DELETE FROM projects WHERE id = ? AND owner_id = ?",
    [projectId, userId]
  );

  return project;
};