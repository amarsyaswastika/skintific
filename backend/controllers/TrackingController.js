const TrackingModel = require("../models/TrackingModel");
const ShipmentModel = require("../models/ShipmentModel");

// [SPRINT 5] Import validator & error handler
const { validateId, validateTracking } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class TrackingController {
  // GET all tracking
  index(req, res) {
    TrackingModel.getAll((err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      // [SPRINT 5] Success response
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // GET tracking by id
  show(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getById(req.params.id, (err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      if (results.length === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // [SPRINT 5] Success response
      successResponse(res, results[0], "Berhasil ambil data tracking");
    });
  }

  // GET tracking by shipment
  getByShipment(req, res) {
    // [SPRINT 5] Validasi ID shipment
    const idError = validateId(req.params.shipmentId);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getByShipment(req.params.shipmentId, (err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      // [SPRINT 5] Success response
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // POST create tracking
  store(req, res) {
    // [SPRINT 5] Validasi input tracking
    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { shipment_id, status, location, description } = req.body;

    TrackingModel.create(req.body, (err, result) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal menambah tracking");
      
      // Update status shipment (ini kode asli, tidak perlu komen)
      ShipmentModel.updateStatus(shipment_id, status, () => {});
      
      // [SPRINT 5] Success response
      successResponse(res, { id: result.insertId }, "Tracking berhasil ditambahkan", 201);
    });
  }

  // PUT update tracking
  update(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // [SPRINT 5] Validasi input tracking
    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    TrackingModel.update(req.params.id, req.body, (err, result) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal update tracking");
      if (result.affectedRows === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // [SPRINT 5] Success response
      successResponse(res, null, "Tracking berhasil diupdate");
    });
  }

  // DELETE tracking
  destroy(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.delete(req.params.id, (err, result) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal hapus tracking");
      if (result.affectedRows === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // [SPRINT 5] Success response
      successResponse(res, null, "Tracking berhasil dihapus");
    });
  }
}

module.exports = new TrackingController();
const TrackingModel = require("../models/TrackingModel");
const ShipmentModel = require("../models/ShipmentModel");
const db = require("../config/database"); // ← TAMBAHKAN UNTUK QUERY LANGSUNG

// Import validator & error handler
const { validateId, validateTracking } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class TrackingController {
  // GET all tracking
  index(req, res) {
    TrackingModel.getAll((err, results) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      // Success response
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // GET tracking by id
  show(req, res) {
    // Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getById(req.params.id, (err, results) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil数据 tracking");
      if (results.length === 0) {
        // Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // Success response
      successResponse(res, results[0], "Berhasil ambil data tracking");
    });
  }

  // GET tracking by shipment
  getByShipment(req, res) {
    // Validasi ID shipment
    const idError = validateId(req.params.shipmentId);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getByShipment(req.params.shipmentId, (err, results) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      // Success response
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // ==================== PUBLIC TRACKING (TANPA AUTH) ====================
  publicTrack(req, res) {
    const { trackingNumber } = req.params;
    
    if (!trackingNumber) {
      return errorResponse(res, "Nomor tracking wajib diisi", 400);
    }

    // Cari shipment berdasarkan tracking number
    const shipmentSql = `
      SELECT s.*, c.vendor_name as courier_name 
      FROM shipments s
      LEFT JOIN couriers c ON s.courier_id = c.id
      WHERE s.tracking_number = ?
    `;
    
    db.query(shipmentSql, [trackingNumber], (err, shipmentResults) => {
      if (err) return errorResponse(res, err, 500, "Gagal melacak pengiriman");
      
      if (shipmentResults.length === 0) {
        return errorResponse(res, "Nomor tracking tidak ditemukan", 404);
      }
      
      const shipment = shipmentResults[0];
      
      // Ambil timeline tracking
      const timelineSql = `
        SELECT * FROM tracking_timeline 
        WHERE shipment_id = ? 
        ORDER BY updated_at ASC
      `;
      
      db.query(timelineSql, [shipment.id], (err, timelineResults) => {
        if (err) return errorResponse(res, err, 500, "Gagal mengambil riwayat tracking");
        
        successResponse(res, {
          shipment: shipment,
          timeline: timelineResults
        }, "Berhasil melacak pengiriman");
      });
    });
  }

  // POST create tracking
  store(req, res) {
    // Validasi input tracking
    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { shipment_id, status, location, description } = req.body;

    TrackingModel.create(req.body, (err, result) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal menambah tracking");
      
      // Update status shipment
      ShipmentModel.updateStatus(shipment_id, status, () => {});
      
      // Success response
      successResponse(res, { id: result.insertId }, "Tracking berhasil ditambahkan", 201);
    });
  }

  // PUT update tracking
  update(req, res) {
    // Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // Validasi input tracking
    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    TrackingModel.update(req.params.id, req.body, (err, result) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal update tracking");
      if (result.affectedRows === 0) {
        // Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // Success response
      successResponse(res, null, "Tracking berhasil diupdate");
    });
  }

  // DELETE tracking
  destroy(req, res) {
    // Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.delete(req.params.id, (err, result) => {
      // Error handler
      if (err) return errorResponse(res, err, 500, "Gagal hapus tracking");
      if (result.affectedRows === 0) {
        // Error handler data tidak ditemukan
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      // Success response
      successResponse(res, null, "Tracking berhasil dihapus");
    });
  }
}

module.exports = new TrackingController();
