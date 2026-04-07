const ShipmentModel = require("../models/ShipmentModel");
const TrackingModel = require("../models/TrackingModel");

class ShipmentController {
  // GET all shipments
  index(req, res) {
    ShipmentModel.getAll((err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Berhasil ambil data pengiriman", data: results });
    });
  }

  // GET shipment by id
  show(req, res) {
    ShipmentModel.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Pengiriman tidak ditemukan" });
      }
      res.json({ success: true, data: results[0] });
    });
  }

  // GET shipment by tracking number
  track(req, res) {
    const { trackingNumber } = req.params;
    ShipmentModel.getByTrackingNumber(trackingNumber, (err, shipment) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (shipment.length === 0) {
        return res.status(404).json({ success: false, message: "Pengiriman tidak ditemukan" });
      }

      TrackingModel.getByShipment(shipment[0].id, (err, tracking) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({
          success: true,
          data: {
            shipment: shipment[0],
            tracking_history: tracking
          }
        });
      });
    });
  }

  // GET shipments by user
  getUserShipments(req, res) {
    const userId = req.params.userId || req.user.userId;
    ShipmentModel.getByUser(userId, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: results });
    });
  }

  // POST create shipment
  store(req, res) {
    const { courier_id, tracking_number, sender_name, receiver_name, status, total_cost } = req.body;
    if (!courier_id || !tracking_number || !sender_name || !receiver_name) {
      return res.status(400).json({ 
        success: false, 
        message: "Field wajib: courier_id, tracking_number, sender_name, receiver_name" 
      });
    }

    const shipmentData = {
      ...req.body,
      user_id: req.user.userId || req.body.user_id,
      status: status || "pending"
    };

    ShipmentModel.create(shipmentData, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      
      // Buat tracking awal
      const trackingData = {
        shipment_id: result.insertId,
        status: "pending",
        location: req.body.origin || "Jakarta",
        description: "Pengiriman telah dibuat"
      };
      TrackingModel.create(trackingData, () => {});

      res.status(201).json({ 
        success: true, 
        message: "Pengiriman berhasil dibuat", 
        id: result.insertId 
      });
    });
  }

  // PUT update shipment
  update(req, res) {
    ShipmentModel.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Pengiriman berhasil diupdate" });
    });
  }

  // PUT update status only
  updateStatus(req, res) {
    const { status } = req.body;
    const shipmentId = req.params.id;

    ShipmentModel.updateStatus(shipmentId, status, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      
      // Tambah tracking status update
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
      
      res.json({ success: true, message: "Status pengiriman berhasil diupdate" });
    });
  }

  // DELETE shipment
  destroy(req, res) {
    // Hapus tracking terlebih dahulu
    TrackingModel.deleteByShipment(req.params.id, () => {
      ShipmentModel.delete(req.params.id, (err) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, message: "Pengiriman berhasil dihapus" });
      });
    });
  }
}

module.exports = new ShipmentController();