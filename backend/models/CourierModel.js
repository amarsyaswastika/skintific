const db = require("../config/database");

class CourierModel {
  // Get all couriers
  static getAll(callback) {
    const sql = "SELECT * FROM couriers ORDER BY created_at DESC";
    db.query(sql, callback);
  }

  // Get courier by id
  static getById(id, callback) {
    const sql = "SELECT * FROM couriers WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // Create new courier (HANYA vendor_name, phone, logo_url)
  static create(data, callback) {
    const sql = `
      INSERT INTO couriers (vendor_name, phone, logo_url) 
      VALUES (?, ?, ?)
    `;
    db.query(sql, [
      data.vendor_name,
      data.phone || null,
      data.logo_url || null
    ], callback);
  }

  // Update courier (HANYA vendor_name, phone, logo_url)
  static update(id, data, callback) {
    if (data.logo_url) {
      const sql = `
        UPDATE couriers 
        SET vendor_name = ?, phone = ?, logo_url = ?
        WHERE id = ?
      `;
      db.query(sql, [
        data.vendor_name,
        data.phone || null,
        data.logo_url,
        id
      ], callback);
    } else {
      const sql = `
        UPDATE couriers 
        SET vendor_name = ?, phone = ?
        WHERE id = ?
      `;
      db.query(sql, [
        data.vendor_name,
        data.phone || null,
        id
      ], callback);
    }
  }

  // Delete courier
  static delete(id, callback) {
    const sql = "DELETE FROM couriers WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = CourierModel;