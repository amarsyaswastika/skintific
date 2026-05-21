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

  // PUT update user
  update(req, res) {
    const { name, email, phone, address } = req.body;

    UserModel.update(
      req.params.id,
      { name, email, phone, address },
      (err) => {
        if (err)
          return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "User berhasil diupdate" });
      },
    );
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

  // PUT update user password
  updatePassword(req, res) {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password wajib diisi",
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
    UserModel.delete(req.params.id, (err) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "User berhasil dihapus" });
    });
  }

  // ==================== METHOD UNTUK PROFILE SENDIRI ====================

  // GET own profile
  getProfile(req, res) {
    const userId = req.user.id;
    
    UserModel.getById(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Gagal mengambil profile",
          error: err.message 
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "User tidak ditemukan" 
        });
      }
      // Hapus password dari response
      const { password, ...userData } = results[0];
      res.json({ 
        success: true, 
        message: "Berhasil ambil profile",
        data: userData 
      });
    });
  }

  // UPDATE own profile
  updateProfile(req, res) {
    const userId = req.user.id;
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Nama wajib diisi"
      });
    }

    // Ambil data user dulu untuk mendapatkan email
    UserModel.getById(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      const user = results[0];
      UserModel.update(userId, {
        name: name,
        email: user.email, // email tetap
        phone: phone || null,
        address: address || null
      }, (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ 
          success: true, 
          message: "Profile berhasil diupdate" 
        });
      });
    });
  }

  // UPDATE own password
  updateOwnPassword(req, res) {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Password lama dan password baru wajib diisi"
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password baru minimal 6 karakter"
      });
    }

    // Ambil user untuk cek password lama
    UserModel.getById(userId, (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      const isValid = bcrypt.compareSync(current_password, results[0].password);
      
      if (!isValid) {
        return res.status(401).json({ 
          success: false, 
          message: "Password lama salah" 
        });
      }

      const hashedPassword = bcrypt.hashSync(new_password, 10);
      UserModel.updatePassword(userId, hashedPassword, (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ 
          success: true, 
          message: "Password berhasil diubah" 
        });
      });
    });
  }
}

module.exports = new UserController();