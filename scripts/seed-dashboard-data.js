
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import pool from "../src/config/mysql.js";
import connectMongoDB from "../src/config/mongodb.js";
import Task from "../src/models/Task.js";

const demoPassword = "Demo@12345";

const users = [
  ["Aarav Sharma", "aarav.sharma"],
  ["Priya Patil", "priya.patil"],
  ["Rohan Deshmukh", "rohan.deshmukh"],
  ["Ananya Kulkarni", "ananya.kulkarni"],
  ["Rahul Verma", "rahul.verma"],
  ["Sneha Joshi", "sneha.joshi"],
  ["Aditya Pawar", "aditya.pawar"],
  ["Kavya Gupta", "kavya.gupta"],
  ["Vikram Shinde", "vikram.shinde"],
  ["Neha Jadhav", "neha.jadhav"],
  ["Arjun Mehta", "arjun.mehta"],
  ["Pooja More", "pooja.more"],
  ["Sahil Shah", "sahil.shah"],
  ["Ishita Desai", "ishita.desai"],
  ["Karan Singh", "karan.singh"],
  ["Meera Nair", "meera.nair"],
  ["Omkar Patil", "omkar.patil"],
  ["Diya Joshi", "diya.joshi"],
  ["Varun Rao", "varun.rao"],
  ["Tanvi Kulkarni", "tanvi.kulkarni"],
];

const projects = [
  "Task Management API",
  "Portfolio Website",
  "Ecommerce Platform",
  "Student Management System",
  "Employee Dashboard",
  "Online Learning Platform",
  "Inventory Management",
  "Expense Tracker",
  "Job Portal",
  "Blog Management System",
  "Hospital Management",
  "Food Delivery App",
  "Chat Application",
  "Event Management System",
  "Library Management",
  "CRM Dashboard",
  "Booking Platform",
  "Payment Integration",
  "Analytics Dashboard",
  "Notification Service",
];

const statuses = ["todo", "in_progress", "completed"];
const priorities = ["low", "medium", "high"];

const main = async () => {
  try {
    // Connect to both databases
    await pool.query("SELECT 1");
    await connectMongoDB();

    console.log("Connected to MySQL and MongoDB.");

    const passwordHash = await bcrypt.hash(demoPassword, 10);
    let demoUserId;

    // Create or find the 20 test users
    for (let i = 0; i < users.length; i++) {
      const [name, username] = users[i];
      const email = `${username}@example.com`;

      const [existing] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      let userId;

      if (existing.length > 0) {
        userId = existing[0].id;
      } else {
        const [result] = await pool.execute(
          `INSERT INTO users (name, email, password_hash)
           VALUES (?, ?, ?)`,
          [name, email, passwordHash]
        );

        userId = result.insertId;
      }

      // Use the first user for dashboard demonstration
      if (i === 0) {
        demoUserId = userId;
      }
    }

    console.log("20 test users are ready.");

    // Create 20 projects owned by the demo user
    const projectIds = [];

    for (let i = 0; i < projects.length; i++) {
      const projectName = projects[i];

      const [existing] = await pool.execute(
        `SELECT id FROM projects
         WHERE owner_id = ? AND name = ?`,
        [demoUserId, projectName]
      );

      let projectId;

      if (existing.length > 0) {
        projectId = existing[0].id;
      } else {
        const [result] = await pool.execute(
          `INSERT INTO projects
           (name, description, status, owner_id)
           VALUES (?, ?, ?, ?)`,
          [
            projectName,
            `Demo project: ${projectName}`,
            ["active", "completed", "archived"][i % 3],
            demoUserId,
          ]
        );

        projectId = result.insertId;
      }

      projectIds.push(projectId);
    }

    console.log("20 demo projects are ready.");

    // Create 40 tasks linked to the demo user's projects
    let taskCount = 0;

    for (let i = 0; i < 40; i++) {
      const projectId = projectIds[i % projectIds.length];
      const title = `Demo Task ${String(i + 1).padStart(2, "0")}`;

      const existingTask = await Task.findOne({
        ownerId: demoUserId,
        title,
      });

      if (existingTask) {
        taskCount++;
        continue;
      }

      await Task.create({
        title,
        description: `Sample task ${i + 1} for dashboard testing`,
        projectId,
        ownerId: demoUserId,
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
      });

      taskCount++;
    }

    console.log("40 demo tasks are ready.");

    console.log("\nSeed completed successfully!");
    console.log("Dashboard demo login:");
    console.log("Email: aarav.sharma@example.com");
    console.log(`Password: ${demoPassword}`);
    console.log(`User ID: ${demoUserId}`);
    console.log(`Projects: ${projectIds.length}`);
    console.log(`Tasks: ${taskCount}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await Promise.allSettled([
      pool.end(),
      mongoose.disconnect(),
    ]);
  }
};

main();
