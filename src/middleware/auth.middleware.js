import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authentication token is required", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store the logged-in user's ID in the request
    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired token", 401));
  }
};

export default authMiddleware;
