const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

class UserController {
  // GET all users
  index(req, res) {
    UserModel.getAll((err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({
        success: true,
        message: "Berhasil ambil data users",
        data: results,
      });
    });
  }

  // GET user by id
  show(req, res) {
    UserModel.getById(req.params.id, (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User tidak ditemukan" });
      }
      res.json({ success: true, data: results[0] });
    });
  }

  // POST create user
  store(req, res) {
    const { name, email, password, phone, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Cek email sudah terdaftar
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
          message: "User berhasil ditambahkan",
          id: result.insertId,
        });
      });
    });
  }

  // PUT update user (bisa update password)
  update(req, res) {
    const { name, email, phone, address, role, password } = req.body;

    // Validasi input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Nama dan email wajib diisi",
      });
    }

    // Cek email sudah terdaftar oleh user lain
    UserModel.getByEmail(email, (err, results) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });

      // Jika email sudah dipakai user lain (bukan dirinya sendiri)
      if (results.length > 0 && results[0].id != req.params.id) {
        return res.status(400).json({
          success: false,
          message: "Email sudah terdaftar oleh user lain",
        });
      }

      let updateData = { name, email, phone, address, role };

      // Jika password diisi, hash dan update juga
      if (password && password.trim() !== "") {
        updateData.password = bcrypt.hashSync(password, 10);
        console.log(`🔑 Password diubah untuk user: ${email}`);
      }

      UserModel.update(req.params.id, updateData, (err, result) => {
        if (err) {
          console.error("Error update user:", err);
          return res.status(500).json({ success: false, error: err.message });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User tidak ditemukan" });
        }
        res.json({ success: true, message: "User berhasil diupdate" });
      });
    });
  }

  // PUT update user role
  updateRole(req, res) {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role wajib diisi",
      });
    }

    UserModel.updateRole(req.params.id, role, (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Role user berhasil diupdate" });
    });
  }

  // PUT update user password (endpoint terpisah untuk reset password)
  updatePassword(req, res) {
    const { password } = req.body;

    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    UserModel.updatePassword(req.params.id, hashedPassword, (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Password user berhasil diupdate" });
    });
  }

  // DELETE user
  destroy(req, res) {
    // Cek apakah user menghapus dirinya sendiri
    if (req.params.id == req.user?.userId) {
      return res.status(400).json({
        success: false,
        message: "Tidak bisa menghapus akun sendiri",
      });
    }

    UserModel.delete(req.params.id, (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "User berhasil dihapus" });
    });
  }
}

module.exports = new UserController();
