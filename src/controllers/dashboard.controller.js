import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await getDashboardData(req.user.id);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};
