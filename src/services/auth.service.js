
import pool from "../config/mysql.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

// Register a new user
export const registerUser = async (name, email, password) => {
  // Check if the email already exists
  const [users] = await pool.execute(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (users.length > 0) {
    throw new AppError("Email is already registered", 409);
  }

  // Hash the password before saving it
  const passwordHash = await bcrypt.hash(password, 10);

  // Save the user in MySQL
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)`,
    [name, email, passwordHash]
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

// Login an existing user
export const loginUser = async (email, password) => {
  // Find the user by email
  const [users] = await pool.execute(
    `SELECT id, name, email, password_hash
     FROM users
     WHERE email = ?`,
    [email]
  );

  const user = users[0];

  // Check whether the user exists
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare the entered password with the stored hash
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};


 // Get the logged-in user's profile
export const getUserProfile = async (userId) => {
  const [users] = await pool.execute(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [userId]
  );

  if (users.length === 0) {
    throw new AppError("User not found", 404);
  }

  return users[0];
};

// Update the logged-in user's profile
export const updateUserProfile = async (userId, name, email) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check whether another user already uses this email
  const [existingUsers] = await pool.execute(
    "SELECT id FROM users WHERE email = ? AND id != ?",
    [normalizedEmail, userId]
  );

  if (existingUsers.length > 0) {
    throw new AppError("Email is already registered", 409);
  }

  const [result] = await pool.execute(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    [name.trim(), normalizedEmail, userId]
  );

  if (result.affectedRows === 0) {
    throw new AppError("User not found", 404);
  }

  return getUserProfile(userId);
};
