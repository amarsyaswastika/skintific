const db = require("../config/database");

class ShipmentModel {
  // Get all shipments
  static getAll(callback) {
    db.query(`SELECT s.*, c.vendor_name as courier_name, u.name as user_name 
              FROM shipments s 
              LEFT JOIN couriers c ON s.courier_id = c.id 
              LEFT JOIN users u ON s.user_id = u.id 
              ORDER BY s.created_at DESC`, callback);
  }

  // Get shipment by ID
  static getById(id, callback) {
    db.query(`SELECT s.*, c.vendor_name as courier_name, u.name as user_name 
              FROM shipments s 
              LEFT JOIN couriers c ON s.courier_id = c.id 
              LEFT JOIN users u ON s.user_id = u.id 
              WHERE s.id = ?`, [id], callback);
  }

  // Get shipment by tracking number
  static getByTrackingNumber(trackingNumber, callback) {
    db.query(`SELECT s.*, c.vendor_name as courier_name 
              FROM shipments s 
              LEFT JOIN couriers c ON s.courier_id = c.id 
              WHERE s.tracking_number = ?`, [trackingNumber], callback);
  }

  // Create new shipment (LENGKAP)
  static create(data, callback) {
    const sql = `INSERT INTO shipments (user_id, courier_id, tracking_number, sender_name, 
                receiver_name, receiver_address, destination, service_type, weight, item_description, status, total_cost) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [
      data.user_id || null, 
      data.courier_id, 
      data.tracking_number, 
      data.sender_name, 
      data.receiver_name,
      data.receiver_address || null,
      data.destination || null,
      data.service_type || 'Reguler',
      data.weight || null,
      data.item_description || null,
      data.status || "pending", 
      data.total_cost || null
    ], callback);
  }

  // Update shipment
  static update(id, data, callback) {
    const sql = `UPDATE shipments SET courier_id = ?, sender_name = ?, receiver_name = ?, 
                receiver_address = ?, destination = ?, service_type = ?, weight = ?, item_description = ?, status = ?, total_cost = ? 
                WHERE id = ?`;
    db.query(sql, [
      data.courier_id, 
      data.sender_name, 
      data.receiver_name, 
      data.receiver_address || null,
      data.destination || null,
      data.service_type || 'Reguler',
      data.weight || null,
      data.item_description || null,
      data.status, 
      data.total_cost, 
      id
    ], callback);
  }

  // Update status only
  static updateStatus(id, status, callback) {
    db.query("UPDATE shipments SET status = ? WHERE id = ?", [status, id], callback);
  }

  // Delete shipment
  static delete(id, callback) {
    db.query("DELETE FROM shipments WHERE id = ?", [id], callback);
  }

  // Get dashboard stats
  static getStats(callback) {
    const sql = `
      SELECT 
        COUNT(*) as total_paket,
        SUM(CASE WHEN status = 'in-transit' THEN 1 ELSE 0 END) as in_transit,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered
      FROM shipments
    `;
    db.query(sql, callback);
  }
  
  // Get monthly shipment statistics for chart
  static getMonthlyStats(callback) {
    const sql = `
      SELECT 
        MONTH(created_at) as month,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered
      FROM shipments
      WHERE YEAR(created_at) = YEAR(CURDATE())
      GROUP BY MONTH(created_at)
      ORDER BY month ASC
    `;
    db.query(sql, callback);
  }
}

module.exports = ShipmentModel;