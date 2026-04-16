const RateModel = require("../models/RateModel");

class RateController {
    // GET all rates
    index(req, res) {
        RateModel.getAll((err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Berhasil ambil data tarif", data: results });
        });
    }

    // GET rate by id
    show(req, res) {
        RateModel.getById(req.params.id, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "Tarif tidak ditemukan" });
            }
            res.json({ success: true, data: results[0] });
        });
    }

    // GET rates by route
    getByRoute(req, res) {
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: "Origin dan destination wajib diisi"
            });
        }
        RateModel.getByRoute(origin, destination, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, data: results });
        });
    }

    // POST create rate
    store(req, res) {
        const { courier_id, origin, destination, service_type, price_per_kg } = req.body;
        if (!courier_id || !origin || !destination || !service_type || !price_per_kg) {
            return res.status(400).json({
                success: false,
                message: "Semua field wajib diisi"
            });
        }

        RateModel.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(201).json({
                success: true,
                message: "Tarif berhasil ditambahkan",
                id: result.insertId
            });
        });
    }

    // PUT update rate
    update(req, res) {
        RateModel.update(req.params.id, req.body, (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Tarif berhasil diupdate" });
        });
    }
    // DELETE rate
    destroy(req, res) {
        RateModel.delete(req.params.id, (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, message: "Tarif berhasil dihapus" });
        });
    }

    // POST calculate price
    calculate(req, res) {
        const { courier_id, origin, destination, weight } = req.body;
        if (!courier_id || !origin || !destination || !weight) {
            return res.status(400).json({
                success: false,
                message: "courier_id, origin, destination, weight wajib diisi"
            });
        }

        RateModel.calculatePrice(courier_id, origin, destination, weight, (err, totalPrice) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (totalPrice === null) {
                return res.status(404).json({
                    success: false,
                    message: "Tarif tidak ditemukan untuk rute tersebut"
                });
            }
            res.json({
                success: true,
                data: { courier_id, origin, destination, weight, total_price: totalPrice }
            });
        });
    }
}

module.exports = new RateController();
