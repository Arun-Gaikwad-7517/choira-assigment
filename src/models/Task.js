
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Task title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    // References the project ID stored in MySQL.
    projectId: {
      type: Number,
      required: [true, "Project ID is required"],
      min: [1, "Project ID must be a positive number"],
    },

    // References the user ID stored in MySQL.
    ownerId: {
      type: Number,
      required: [true, "Owner ID is required"],
      min: [1, "Owner ID must be a positive number"],
    },

    status: {
      type: String,
      enum: {
        values: ["todo", "in_progress", "completed"],
        message: "Invalid task status",
      },
      default: "todo",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Invalid task priority",
      },
      default: "medium",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ ownerId: 1, projectId: 1 });
taskSchema.index({ ownerId: 1, status: 1 });
taskSchema.index({ ownerId: 1, priority: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
