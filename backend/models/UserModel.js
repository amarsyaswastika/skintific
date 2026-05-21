const db = require("../config/database");

class UserModel {
  // Get all users
  static getAll(callback) {
    db.query(
      "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users",
      callback,
    );
  }

  // Get user by ID
  static getById(id, callback) {
    db.query(
      "SELECT id, name, email, phone, address, role, created_at, updated_at FROM users WHERE id = ?",
      [id],
      callback,
    );
  }

  // Get user by email
  static getByEmail(email, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  }

  // Create new user
  static create(data, callback) {
    const sql =
      "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        data.name,
        data.email,
        data.password,
        data.phone || null,
        data.address || null,
        data.role || "customer",
      ],
      callback,
    );
  }

  // Update user
  static update(id, data, callback) {
    const sql =
      "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?";
    db.query(
      sql,
      [data.name, data.email, data.phone, data.address, id],
      callback,
    );
  }

  // Update password
  static updatePassword(id, password, callback) {
    db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [password, id],
      callback,
    );
  }

  // Update role
  static updateRole(id, role, callback) {
    db.query("UPDATE users SET role = ? WHERE id = ?", [role, id], callback);
  }

  // Delete user
  static delete(id, callback) {
    db.query("DELETE FROM users WHERE id = ?", [id], callback);
  }
}

module.exports = UserModel;
