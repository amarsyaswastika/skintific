const db = require("../config/database");

class TrackingModel {
  // Get all tracking
  static getAll(callback) {
    db.query(`SELECT tt.*, s.tracking_number, s.sender_name, s.receiver_name 
              FROM tracking_timeline tt 
              JOIN shipments s ON tt.shipment_id = s.id 
              ORDER BY tt.updated_at DESC`, callback);
  }

  // Get tracking by ID
  static getById(id, callback) {
    db.query(`SELECT tt.*, s.tracking_number 
              FROM tracking_timeline tt 
              JOIN shipments s ON tt.shipment_id = s.id 
              WHERE tt.id = ?`, [id], callback);
  }

  // Get tracking by shipment
  static getByShipment(shipmentId, callback) {
    db.query("SELECT * FROM tracking_timeline WHERE shipment_id = ? ORDER BY updated_at ASC", [shipmentId], callback);
  }

  // Get latest tracking by shipment
  static getLatestByShipment(shipmentId, callback) {
    db.query("SELECT * FROM tracking_timeline WHERE shipment_id = ? ORDER BY updated_at DESC LIMIT 1", [shipmentId], callback);
  }

  // Create new tracking
  static create(data, callback) {
    const sql = "INSERT INTO tracking_timeline (shipment_id, status, location, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [data.shipment_id, data.status, data.location, data.description], callback);
  }

  // Create with custom timestamp
  static createWithTimestamp(data, callback) {
    const sql = "INSERT INTO tracking_timeline (shipment_id, status, location, description, updated_at) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [data.shipment_id, data.status, data.location, data.description, data.updated_at], callback);
  }

  // Update tracking
  static update(id, data, callback) {
    const sql = "UPDATE tracking_timeline SET status = ?, location = ?, description = ? WHERE id = ?";
    db.query(sql, [data.status, data.location, data.description, id], callback);
  }

  // Delete tracking
  static delete(id, callback) {
    db.query("DELETE FROM tracking_timeline WHERE id = ?", [id], callback);
  }

  // Delete all tracking by shipment
  static deleteByShipment(shipmentId, callback) {
    db.query("DELETE FROM tracking_timeline WHERE shipment_id = ?", [shipmentId], callback);
  }
}

module.exports = TrackingModel;
