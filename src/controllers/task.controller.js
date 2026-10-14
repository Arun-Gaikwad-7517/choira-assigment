import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service.js";

// Create a task
export const createTaskController = async (req, res, next) => {
  try {
    const task = await createTask(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks
export const getAllTasksController = async (req, res, next) => {
  try {
    const result = await getAllTasks(req.user.id, req.query);

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: result.tasks,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Get one task
export const getTaskByIdController = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTaskController = async (req, res, next) => {
  try {
    const task = await updateTask(
      req.params.id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTaskController = async (req, res, next) => {
  try {
    await deleteTask(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
