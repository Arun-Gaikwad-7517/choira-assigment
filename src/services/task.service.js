import Task from "../models/Task.js";
import pool from "../config/mysql.js";
import AppError from "../utils/AppError.js";

// Check whether the project belongs to the logged-in user
const checkProjectOwnership = async (projectId, userId) => {
  const [projects] = await pool.execute(
    "SELECT id FROM projects WHERE id = ? AND owner_id = ?",
    [projectId, userId]
  );

  if (projects.length === 0) {
    throw new AppError("Project not found", 404);
  }
};

// Create a task
export const createTask = async (taskData, userId) => {
  await checkProjectOwnership(taskData.projectId, userId);

  const task = await Task.create({
    title: taskData.title,
    description: taskData.description || "",
    projectId: taskData.projectId,
    ownerId: userId,
    status: taskData.status || "todo",
    priority: taskData.priority || "medium",
  });

  return task;
};

// Get all tasks with pagination and filters
export const getAllTasks = async (userId, filters) => {
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { ownerId: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.projectId !== undefined) {
    await checkProjectOwnership(filters.projectId, userId);
    query.projectId = Number(filters.projectId);
  }

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalRecords = await Task.countDocuments(query);

  return {
    tasks,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    },
  };
};

// Get one task
export const getTaskById = async (taskId, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    ownerId: userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

// Update a task
export const updateTask = async (taskId, taskData, userId) => {
  const task = await Task.findOne({
    _id: taskId,
    ownerId: userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // Check ownership if the project is being changed
  if (taskData.projectId !== undefined) {
    await checkProjectOwnership(taskData.projectId, userId);
    task.projectId = taskData.projectId;
  }

  if (taskData.title !== undefined) {
    task.title = taskData.title;
  }

  if (taskData.description !== undefined) {
    task.description = taskData.description;
  }

  if (taskData.status !== undefined) {
    task.status = taskData.status;
  }

  if (taskData.priority !== undefined) {
    task.priority = taskData.priority;
  }

  await task.save();

  return task;
};

// Delete a task
export const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({
    _id: taskId,
    ownerId: userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};
