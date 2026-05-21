const ShipmentModel = require("../models/ShipmentModel");
const TrackingModel = require("../models/TrackingModel");

// Import validator & error handler
const { validateId, validateShipment, validateShipmentStatus } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class ShipmentController {
  // GET all shipments
  index(req, res) {
    ShipmentModel.getAll((err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      successResponse(res, results, "Berhasil ambil data pengiriman");
    });
  }

  // GET dashboard stats
  getStats(req, res) {
    ShipmentModel.getStats((err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil statistik");
      successResponse(res, results[0] || { total_paket: 0, in_transit: 0, pending: 0, delivered: 0 }, "Berhasil ambil statistik");
    });
  }

  // GET monthly shipment statistics for chart
  getMonthlyStats(req, res) {
    ShipmentModel.getMonthlyStats((err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil statistik bulanan");
      
      // Inisialisasi array 12 bulan (Jan-Dec) dengan nilai 0
      const monthlyShipments = Array(12).fill(0);
      const monthlyDeliveries = Array(12).fill(0);
      
      results.forEach(row => {
        const monthIndex = row.month - 1; // Jan=0, Feb=1, dst
        monthlyShipments[monthIndex] = row.total;
        monthlyDeliveries[monthIndex] = row.delivered;
      });
      
      successResponse(res, {
        shipments: monthlyShipments,
        deliveries: monthlyDeliveries
      }, "Berhasil ambil statistik bulanan");
    });
  }

  // GET shipment by id
  show(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    ShipmentModel.getById(req.params.id, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      if (results.length === 0) {
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }
      successResponse(res, results[0], "Berhasil ambil data pengiriman");
    });
  }

  // GET shipment by tracking number
  track(req, res) {
    const { trackingNumber } = req.params;
    if (!trackingNumber) {
      return errorResponse(res, "Nomor tracking wajib diisi", 400, "Parameter tidak lengkap");
    }

    ShipmentModel.getByTrackingNumber(trackingNumber, (err, shipment) => {
      if (err) return errorResponse(res, err, 500, "Gagal melacak pengiriman");
      if (shipment.length === 0) {
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }

      TrackingModel.getByShipment(shipment[0].id, (err, tracking) => {
        if (err) return errorResponse(res, err, 500, "Gagal mengambil riwayat tracking");
        successResponse(res, {
          shipment: shipment[0],
          tracking_history: tracking
        }, "Berhasil melacak pengiriman");
      });
    });
  }

  // GET tracking timeline untuk shipment tertentu
  getTrackingTimeline(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);
    
    TrackingModel.getByShipment(req.params.id, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data tracking");
      successResponse(res, results, "Berhasil ambil data tracking timeline");
    });
  }

  // GET shipments by user
  getUserShipments(req, res) {
    const userId = req.params.userId || req.user.userId;
    const idError = validateId(userId);
    if (idError) return errorResponse(res, idError, 400, idError);

    ShipmentModel.getByUser(userId, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data pengiriman");
      successResponse(res, results, "Berhasil ambil data pengiriman");
    });
  }

  // POST create shipment
  store(req, res) {
    const validationError = validateShipment(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const shipmentData = {
      ...req.body,
      user_id: req.user.userId || req.body.user_id,
      status: req.body.status || "pending"
    };

    ShipmentModel.create(shipmentData, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return errorResponse(res, "Nomor tracking sudah digunakan", 409, "Data sudah ada");
        }
        return errorResponse(res, err, 500, "Gagal membuat pengiriman");
      }
      
      const trackingData = {
        shipment_id: result.insertId,
        status: "pending",
        location: req.body.origin || "Jakarta",
        description: "Pengiriman telah dibuat"
      };
      TrackingModel.create(trackingData, () => {});

      successResponse(res, { id: result.insertId }, "Pengiriman berhasil dibuat", 201);
    });
  }

  // PUT update shipment
  update(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    const validationError = validateShipment(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    ShipmentModel.update(req.params.id, req.body, (err, result) => {
      if (err) return errorResponse(res, err, 500, "Gagal update pengiriman");
      if (result.affectedRows === 0) {
        return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
      }
      successResponse(res, null, "Pengiriman berhasil diupdate");
    });
  }

  // PUT update status only
  updateStatus(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    const validationError = validateShipmentStatus(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    const { status } = req.body;
    const shipmentId = req.params.id;

    ShipmentModel.updateStatus(shipmentId, status, (err) => {
      if (err) return errorResponse(res, err, 500, "Gagal update status");
      
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
      
      successResponse(res, null, "Status pengiriman berhasil diupdate");
    });
  }

  // DELETE shipment
  destroy(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    TrackingModel.deleteByShipment(req.params.id, () => {
      ShipmentModel.delete(req.params.id, (err, result) => {
        if (err) return errorResponse(res, err, 500, "Gagal hapus pengiriman");
        if (result.affectedRows === 0) {
          return errorResponse(res, "Pengiriman tidak ditemukan", 404, "Pengiriman tidak ditemukan");
        }
        successResponse(res, null, "Pengiriman berhasil dihapus");
      });
    });
  }
}

module.exports = new ShipmentController();