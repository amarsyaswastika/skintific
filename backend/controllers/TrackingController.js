const TrackingModel = require("../models/TrackingModel");
const ShipmentModel = require("../models/ShipmentModel");
const db = require("../config/database");

// Import validator & error handler
const { validateId, validateTracking } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

function recalculateShipmentStatus(shipmentId, callback) {
    const sql = `
    SELECT status FROM tracking_timeline
    WHERE shipment_id = ?
    ORDER BY id DESC
    LIMIT 1
  `;


  db.query(sql, [shipmentId], (err, results) => {
    if (err) {
      console.error("Gagal mengambil tracking terakhir untuk recalculate status:", err);
      return callback(err);
    }

    const latestStatus = results.length > 0 ? results[0].status : "pending";

    ShipmentModel.updateStatus(shipmentId, latestStatus, (err) => {
      if (err) {
        console.error("Gagal update status shipment saat recalculate:", err);
        return callback(err);
      }
      callback(null, latestStatus);
    });
  });
}

class TrackingController {
  // GET all tracking
  index(req, res) {
    TrackingModel.getAll((err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // GET tracking by id
  show(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getById(req.params.id, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      if (results.length === 0) {
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }
      successResponse(res, results[0], "Berhasil ambil data tracking");
    });
  }

  // GET tracking by shipment
  getByShipment(req, res) {
    const idError = validateId(req.params.shipmentId);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.getByShipment(req.params.shipmentId, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      successResponse(res, results, "Berhasil ambil data tracking");
    });
  }

  // ==================== PUBLIC TRACKING (TANPA AUTH) ====================
  publicTrack(req, res) {
    const { trackingNumber } = req.params;

    if (!trackingNumber) {
      return errorResponse(res, "Nomor tracking wajib diisi", 400);
    }

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
    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { shipment_id, status } = req.body;

    TrackingModel.create(req.body, (err, result) => {
      if (err) return errorResponse(res, err, 500, "Gagal menambah tracking");

      ShipmentModel.updateStatus(shipment_id, status, () => {});

      successResponse(res, { id: result.insertId }, "Tracking berhasil ditambahkan", 201);
    });
  }

  // PUT update tracking
  update(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    const validationError = validateTracking(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { shipment_id } = req.body;

    TrackingModel.update(req.params.id, req.body, (err, result) => {
      if (err) return errorResponse(res, err, 500, "Gagal update tracking");
      if (result.affectedRows === 0) {
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }

      // FIX: sinkronkan status shipment dengan entry tracking TERBARU
      // (bukan cuma di-set langsung dari body, karena entry yang diedit
      // belum tentu entry paling baru secara waktu)
      recalculateShipmentStatus(shipment_id, (recalcErr) => {
        if (recalcErr) {
          // Tracking-nya tetap berhasil diupdate, tapi kasih tau kalau sinkronisasi status gagal
          return successResponse(res, null, "Tracking berhasil diupdate, namun status shipment gagal disinkronkan");
        }
        successResponse(res, null, "Tracking berhasil diupdate");
      });
    });
  }

  // DELETE tracking
  destroy(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // Ambil shipment_id dari tracking ini SEBELUM dihapus, karena request
    // DELETE tidak membawa body/shipment_id
    TrackingModel.getById(req.params.id, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal hapus tracking");
      if (results.length === 0) {
        return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
      }

      const shipment_id = results[0].shipment_id;

      TrackingModel.delete(req.params.id, (err, result) => {
        if (err) return errorResponse(res, err, 500, "Gagal hapus tracking");
        if (result.affectedRows === 0) {
          return errorResponse(res, "Tracking tidak ditemukan", 404, "Tracking tidak ditemukan");
        }
        recalculateShipmentStatus(shipment_id, (recalcErr) => {
          if (recalcErr) {
            return successResponse(res, null, "Tracking berhasil dihapus, namun status shipment gagal disinkronkan");
          }
          successResponse(res, null, "Tracking berhasil dihapus");
        });
      });
    });
  }
}

module.exports = new TrackingController();