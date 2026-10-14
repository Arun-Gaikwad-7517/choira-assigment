import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../services/auth.service.js";

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
    console.log("User registered successfully")
    console.log(user)
  } catch (error) {
    next(error);
  }
};

// Login an existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};



 // Get the logged-in user's profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update the logged-in user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await updateUserProfile(
      req.user.id,
      name,
      email
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
