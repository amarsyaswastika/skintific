const CourierModel = require("../models/CourierModel");

class CourierController {
  // GET all couriers
  index(req, res) {
    CourierModel.getAll((err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Berhasil ambil data kurir", data: results });
    });
  }

  // GET courier by id
  show(req, res) {
    CourierModel.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "Kurir tidak ditemukan" });
      }
      res.json({ success: true, data: results[0] });
    });
  }

  // POST create courier
  store(req, res) {
    const { vendor_name, phone, logo_url } = req.body;
    if (!vendor_name) {
      return res.status(400).json({ 
        success: false, 
        message: "Nama vendor wajib diisi" 
      });
    }

    CourierModel.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.status(201).json({ 
        success: true, 
        message: "Kurir berhasil ditambahkan", 
        id: result.insertId 
      });
    });
  }

  // PUT update courier
  update(req, res) {
    CourierModel.update(req.params.id, req.body, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Kurir berhasil diupdate" });
    });
  }

  // DELETE courier
  destroy(req, res) {
    CourierModel.delete(req.params.id, (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, message: "Kurir berhasil dihapus" });
    });
  }
}

module.exports = new CourierController();

