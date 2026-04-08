const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
  // Register user baru
  register(req, res) {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    UserModel.getByEmail(email, (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email sudah terdaftar",
        });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      const userData = {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        address: address || null,
        role: role || "customer",
      };

      UserModel.create(userData, (err, result) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });
        res.status(201).json({
          success: true,
          message: "Registrasi berhasil",
          userId: result.insertId,
        });
      });
    });
  }

  // Login user
  login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
      });
    }

    UserModel.getByEmail(email, (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Email atau password salah",
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.json({
        success: true,
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    });
  }

  // Get profile
  profile(req, res) {
    UserModel.getById(req.user.userId, (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User tidak ditemukan",
        });
      }
      res.json({ success: true, data: results[0] });
    });
  }

  // Update profile
  updateProfile(req, res) {
    const { name, email, phone, address } = req.body;
    const userId = req.user.userId;

    UserModel.update(userId, { name, email, phone, address }, (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Profile berhasil diupdate" });
    });
  }

  // Get all users (admin only)
  getAllUsers(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya admin.",
      });
    }
    UserModel.getAll((err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: results });
    });
  }
}

module.exports = new AuthController();
