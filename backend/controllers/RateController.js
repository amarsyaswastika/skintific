const RateModel = require("../models/RateModel");

// [SPRINT 5] Import validator & error handler
const { validateId, validateRate, validateCalculatePrice } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class RateController {
    // GET all rates
    index(req, res) {
        RateModel.getAll((err, results) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            // [SPRINT 5] Success response
            successResponse(res, results, "Berhasil ambil data tarif");
        });
    }

    // GET rate by id
    show(req, res) {
        // [SPRINT 5] Validasi ID
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400, idError);

        RateModel.getById(req.params.id, (err, results) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            if (results.length === 0) {
                // [SPRINT 5] Error handler data tidak ditemukan
                return errorResponse(res, "Tarif tidak ditemukan", 404, "Tarif tidak ditemukan");
            }
            // [SPRINT 5] Success response
            successResponse(res, results[0], "Berhasil ambil data tarif");
        });
    }

    // GET rates by route
    getByRoute(req, res) {
        const { origin, destination } = req.query;
        // [SPRINT 5] Validasi parameter
        if (!origin || !destination) {
            return errorResponse(res, "Origin dan destination wajib diisi", 400, "Parameter tidak lengkap");
        }
        RateModel.getByRoute(origin, destination, (err, results) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            // [SPRINT 5] Success response
            successResponse(res, results, "Berhasil ambil data tarif");
        });
    }

    // POST create rate
    store(req, res) {
        // [SPRINT 5] Validasi input rate
        const validationError = validateRate(req.body);
        if (validationError) return errorResponse(res, validationError, 400, validationError);

        RateModel.create(req.body, (err, result) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal menambah tarif");
            // [SPRINT 5] Success response
            successResponse(res, { id: result.insertId }, "Tarif berhasil ditambahkan", 201);
        });
    }

    // PUT update rate
    update(req, res) {
        // [SPRINT 5] Validasi ID
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400, idError);

        // [SPRINT 5] Validasi input rate
        const validationError = validateRate(req.body);
        if (validationError) return errorResponse(res, validationError, 400, validationError);

        RateModel.update(req.params.id, req.body, (err, result) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal update tarif");
            if (result.affectedRows === 0) {
                // [SPRINT 5] Error handler data tidak ditemukan
                return errorResponse(res, "Tarif tidak ditemukan", 404, "Tarif tidak ditemukan");
            }
            // [SPRINT 5] Success response
            successResponse(res, null, "Tarif berhasil diupdate");
        });
    }

    // DELETE rate
    destroy(req, res) {
        // [SPRINT 5] Validasi ID
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400, idError);

        RateModel.delete(req.params.id, (err, result) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal hapus tarif");
            if (result.affectedRows === 0) {
                // [SPRINT 5] Error handler data tidak ditemukan
                return errorResponse(res, "Tarif tidak ditemukan", 404, "Tarif tidak ditemukan");
            }
            // [SPRINT 5] Success response
            successResponse(res, null, "Tarif berhasil dihapus");
        });
    }

    // POST calculate price
    calculate(req, res) {
        // [SPRINT 5] Validasi input calculate
        const validationError = validateCalculatePrice(req.body);
        if (validationError) return errorResponse(res, validationError, 400, validationError);

        const { courier_id, origin, destination, weight } = req.body;
        RateModel.calculatePrice(courier_id, origin, destination, weight, (err, totalPrice) => {
            // [SPRINT 5] Error handler
            if (err) return errorResponse(res, err, 500, "Gagal menghitung harga");
            if (totalPrice === null) {
                // [SPRINT 5] Error handler data tidak ditemukan
                return errorResponse(res, "Tarif tidak ditemukan untuk rute tersebut", 404, "Tarif tidak tersedia");
            }
            // [SPRINT 5] Success response
            successResponse(res, { courier_id, origin, destination, weight, total_price: totalPrice }, "Harga berhasil dihitung");
        });
    }
}

module.exports = new RateController();
