import jwt from "jsonwebtoken";

export const adminAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ BOTH role and email must match
    if (
      decoded.role !== "naa-admin" ||
      decoded.email !== process.env.ADMIN_EMAIL
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Unauthorized admin",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
