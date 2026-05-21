const db = require("../config/database");

class UserModel {
  // Get all users
  static getAll(callback) {
    const sql = "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users ORDER BY id";
    db.query(sql, callback);
  }

  // Get user by ID
  static getById(id, callback) {
    const sql = "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // Get user by email (DIPERLUKAN UNTUK AUTH)
  static getByEmail(email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  }

  // Create new user
  static create(data, callback) {
    const sql = "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [
      data.name,
      data.email,
      data.password,
      data.phone || null,
      data.address || null,
      data.role || "customer"
    ], callback);
  }

  // Update user
  static update(id, data, callback) {
    const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
    db.query(sql, [data.name, data.email, data.phone, data.address, id], callback);
  }

  // Update password
  static updatePassword(id, password, callback) {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(sql, [password, id], callback);
  }

  // Update role
  static updateRole(id, role, callback) {
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    db.query(sql, [role, id], callback);
  }

  // Delete user
  static delete(id, callback) {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = UserModel;