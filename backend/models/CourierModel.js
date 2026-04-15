const db = require("../config/database");

class CourierModel {
  // Get all couriers
  static getAll(callback) {
    db.query("SELECT id, vendor_name, phone, logo_url, created_at FROM couriers", callback);
  }

  // Get courier by ID
  static getById(id, callback) {
    db.query("SELECT * FROM couriers WHERE id = ?", [id], callback);
  }

  // Create new courier
  static create(data, callback) {
    const sql = "INSERT INTO couriers (vendor_name, phone, logo_url) VALUES (?, ?, ?)";
    db.query(sql, [data.vendor_name, data.phone || null, data.logo_url || null], callback);
  }

  // Update courier
  static update(id, data, callback) {
    const sql = "UPDATE couriers SET vendor_name = ?, phone = ?, logo_url = ? WHERE id = ?";
    db.query(sql, [data.vendor_name, data.phone, data.logo_url, id], 
callback);
  }

  // Delete courier
  static delete(id, callback) {
    db.query("DELETE FROM couriers WHERE id = ?", [id], callback);
  }
}

module.exports = CourierModel;
