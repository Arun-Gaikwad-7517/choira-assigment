import pool from "../config/mysql.js";
import Task from "../models/Task.js";

export const getDashboardData = async (userId) => {
  // Get project statistics from MySQL
  const [projectStats] = await pool.execute(
    `SELECT
       COUNT(*) AS totalProjects,
       SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS activeProjects,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completedProjects
     FROM projects
     WHERE owner_id = ?`,
    [userId]
  );

  // Get task statistics from MongoDB
  const totalTasks = await Task.countDocuments({
    ownerId: userId,
  });

  const pendingTasks = await Task.countDocuments({
    ownerId: userId,
    status: { $in: ["todo", "in_progress"] },
  });

  const completedTasks = await Task.countDocuments({
    ownerId: userId,
    status: "completed",
  });

  const highPriorityTasks = await Task.countDocuments({
    ownerId: userId,
    priority: "high",
  });

  return {
    projects: {
      total: Number(projectStats[0].totalProjects || 0),
      active: Number(projectStats[0].activeProjects || 0),
      completed: Number(projectStats[0].completedProjects || 0),
    },
    tasks: {
      total: totalTasks,
      pending: pendingTasks,
      completed: completedTasks,
      highPriority: highPriorityTasks,
    },
  };
};
