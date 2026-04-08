const jwt = require("jsonwebtoken");

// Middleware verifikasi token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa.",
    });
  }
};

// Middleware role admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya admin yang diizinkan.",
    });
  }
  next();
};

// Middleware role staff
const isStaff = (req, res, next) => {
  if (req.user.role !== "staff" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya staff yang diizinkan.",
    });
  }
  next();
};

// Middleware role kurir
const isCourier = (req, res, next) => {
  if (req.user.role !== "courier" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya kurir yang diizinkan.",
    });
  }
  next();
};

// Middleware role customer
const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya customer yang diizinkan.",
    });
  }
  next();
};

module.exports = { authMiddleware, isAdmin, isStaff, isCourier, isCustomer };
