const ShipmentModel = require("../models/ShipmentModel");
const TrackingModel = require("../models/TrackingModel");

// [SPRINT 5] Import validator & error handler
const { validateId, validateShipment, validateShipmentStatus } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class ShipmentController {
  // GET all shipments
  index(req, res) {
    ShipmentModel.getAll((err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      // [SPRINT 5] Success response
      successResponse(res, results, "Berhasil ambil data pengiriman");
    });
  }

  // GET shipment by id
  show(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    ShipmentModel.getById(req.params.id, (err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      if (results.length === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }
      // [SPRINT 5] Success response
      successResponse(res, results[0], "Berhasil ambil data pengiriman");
    });
  }

  // GET shipment by tracking number
  track(req, res) {
    const { trackingNumber } = req.params;
    // [SPRINT 5] Validasi parameter
    if (!trackingNumber) {
      return errorResponse(res, "Nomor tracking wajib diisi", 400, "Parameter tidak lengkap");
    }

    ShipmentModel.getByTrackingNumber(trackingNumber, (err, shipment) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal melacak pengiriman");
      if (shipment.length === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }

      TrackingModel.getByShipment(shipment[0].id, (err, tracking) => {
        // [SPRINT 5] Error handler
        if (err) return errorResponse(res, err, 500, "Gagal mengambil riwayat tracking");
        // [SPRINT 5] Success response
        successResponse(res, {
          shipment: shipment[0],
          tracking_history: tracking
        }, "Berhasil melacak pengiriman");
      });
    });
  }

  // GET shipments by user
  getUserShipments(req, res) {
    const userId = req.params.userId || req.user.userId;
    // [SPRINT 5] Validasi ID user
    const idError = validateId(userId);
    if (idError) return errorResponse(res, idError, 400, idError);

    ShipmentModel.getByUser(userId, (err, results) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      // [SPRINT 5] Success response
      successResponse(res, results, "Berhasil ambil data pengiriman");
    });
  }

  // POST create shipment
  store(req, res) {
    // [SPRINT 5] Validasi input shipment
    const validationError = validateShipment(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const shipmentData = {
      ...req.body,
      user_id: req.user.userId || req.body.user_id,
      status: req.body.status || "pending"
    };

    ShipmentModel.create(shipmentData, (err, result) => {
      // [SPRINT 5] Error handler
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // [SPRINT 5] Error handler duplicate tracking number
          return errorResponse(res, "Nomor tracking sudah digunakan", 409, "Data sudah ada");
        }
        return errorResponse(res, err, 500, "Gagal membuat pengiriman");
      }
      
      // Buat tracking awal (kode asli, tidak perlu komen)
      const trackingData = {
        shipment_id: result.insertId,
        status: "pending",
        location: req.body.origin || "Jakarta",
        description: "Pengiriman telah dibuat"
      };
      TrackingModel.create(trackingData, () => {});

      // [SPRINT 5] Success response
      successResponse(res, { id: result.insertId }, "Pengiriman berhasil dibuat", 201);
    });
  }

  // PUT update shipment
  update(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // [SPRINT 5] Validasi input shipment
    const validationError = validateShipment(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    ShipmentModel.update(req.params.id, req.body, (err, result) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal update pengiriman");
      if (result.affectedRows === 0) {
        // [SPRINT 5] Error handler data tidak ditemukan
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }
      // [SPRINT 5] Success response
      successResponse(res, null, "Pengiriman berhasil diupdate");
    });
  }

  // PUT update status only
  updateStatus(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // [SPRINT 5] Validasi status
    const validationError = validateShipmentStatus(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { status } = req.body;
    const shipmentId = req.params.id;

    ShipmentModel.updateStatus(shipmentId, status, (err) => {
      // [SPRINT 5] Error handler
      if (err) return errorResponse(res, err, 500, "Gagal update status");
      
      // Tambah tracking status update (kode asli, tidak perlu komen)
      ShipmentModel.getById(shipmentId, (err, results) => {
        if (!err && results.length > 0) {
          const trackingData = {
            shipment_id: shipmentId,
            status: status,
            location: results[0].origin || "Jakarta",
            description: `Status berubah menjadi ${status}`
          };
          TrackingModel.create(trackingData, () => {});
        }
      });
      
      // [SPRINT 5] Success response
      successResponse(res, null, "Status pengiriman berhasil diupdate");
    });
  }

  // DELETE shipment
  destroy(req, res) {
    // [SPRINT 5] Validasi ID
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    // Hapus tracking terlebih dahulu (kode asli, tidak perlu komen)
    TrackingModel.deleteByShipment(req.params.id, () => {
      ShipmentModel.delete(req.params.id, (err, result) => {
        // [SPRINT 5] Error handler
        if (err) return errorResponse(res, err, 500, "Gagal hapus pengiriman");
        if (result.affectedRows === 0) {
          // [SPRINT 5] Error handler data tidak ditemukan
          return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
        }
        // [SPRINT 5] Success response
        successResponse(res, null, "Pengiriman berhasil dihapus");
      });
    });
  }
}

module.exports = new ShipmentController();
