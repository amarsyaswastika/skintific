const db = require("../config/database");

class CourierModel {
  // Get all couriers
  static getAll(callback) {
    const sql = "SELECT * FROM couriers ORDER BY created_at DESC";
    db.query(sql, callback);
  }

  // Get courier by id
  static getById(id, callback) {
    // PERBAIKAN: pastikan nama kolomnya `id` bukan `courier_id`
    const sql = "SELECT * FROM couriers WHERE id = ?";
    db.query(sql, [id], callback);
  }

  // Create new courier (TAMBAHKAN logo_url)
  static create(data, callback) {
    const sql = `
      INSERT INTO couriers (vendor_name, service_name, price_per_kg, estimation_day, phone, logo_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.vendor_name,
      data.service_name,
      data.price_per_kg,
      data.estimation_day || null,
      data.phone || null,
      data.logo_url || null  // ← TAMBAHKAN logo_url
    ], callback);
  }

  // Update courier (TAMBAHKAN logo_url)
  static update(id, data, callback) {
    // Cek apakah ada logo_url yang dikirim
    if (data.logo_url) {
      const sql = `
        UPDATE couriers 
        SET vendor_name = ?, service_name = ?, price_per_kg = ?, estimation_day = ?, phone = ?, logo_url = ?
        WHERE id = ?
      `;
      db.query(sql, [
        data.vendor_name,
        data.service_name,
        data.price_per_kg,
        data.estimation_day || null,
        data.phone || null,
        data.logo_url,
        id
      ], callback);
    } else {
      const sql = `
        UPDATE couriers 
        SET vendor_name = ?, service_name = ?, price_per_kg = ?, estimation_day = ?, phone = ?
        WHERE id = ?
      `;
      db.query(sql, [
        data.vendor_name,
        data.service_name,
        data.price_per_kg,
        data.estimation_day || null,
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

