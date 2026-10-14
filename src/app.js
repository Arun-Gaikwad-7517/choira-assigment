import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import pool from "./config/mysql.js";
import connectMongoDB from "./config/mongodb.js";

import errorMiddleware from "./middleware/error.middleware.js";
import notFoundMiddleware from "./middleware/not-found.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";




const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Choira Backend API is running",
  });
});

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("MySQL connected successfully");

    await connectMongoDB();
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);

    await Promise.allSettled([
      pool.end(),
      mongoose.disconnect(),
    ]);

    process.exit(1);
  }
};

startServer();

export default app;
