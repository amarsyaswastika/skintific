const RateModel = require("../models/RateModel");
const { validateId, validateRate, validateCalculatePrice } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class RateController {

    // GET all rates
    index(req, res) {
        RateModel.getAll((err, results) => {
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            return successResponse(res, results, "Berhasil ambil data tarif");
        });
    }

    // GET rate by id
    show(req, res) {
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400, idError);

        RateModel.getById(req.params.id, (err, results) => {
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            if (results.length === 0) {
                return errorResponse(res, "Tarif tidak ditemukan", 404);
            }
            return successResponse(res, results[0], "Berhasil ambil data tarif");
        });
    }

    // GET by route
    getByRoute(req, res) {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return errorResponse(res, "Origin dan destination wajib diisi", 400);
        }

        RateModel.getByRoute(origin, destination, (err, results) => {
            if (err) return errorResponse(res, err, 500, "Gagal mengambil data tarif");
            return successResponse(res, results, "Berhasil ambil data tarif");
        });
    }

    // POST create
    store(req, res) {
        const validationError = validateRate(req.body);
        if (validationError) return errorResponse(res, validationError, 400);

        RateModel.create(req.body, (err, result) => {
            if (err) return errorResponse(res, err, 500, "Gagal menambah tarif");
            return successResponse(res, { id: result.insertId }, "Tarif berhasil ditambahkan", 201);
        });
    }

    // PUT update
    update(req, res) {
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400);

        const validationError = validateRate(req.body);
        if (validationError) return errorResponse(res, validationError, 400);

        RateModel.update(req.params.id, req.body, (err, result) => {
            if (err) return errorResponse(res, err, 500, "Gagal update tarif");
            if (result.affectedRows === 0) {
                return errorResponse(res, "Tarif tidak ditemukan", 404);
            }
            return successResponse(res, null, "Tarif berhasil diupdate");
        });
    }

    // DELETE
    destroy(req, res) {
        const idError = validateId(req.params.id);
        if (idError) return errorResponse(res, idError, 400);

        RateModel.delete(req.params.id, (err, result) => {
            if (err) return errorResponse(res, err, 500, "Gagal hapus tarif");
            if (result.affectedRows === 0) {
                return errorResponse(res, "Tarif tidak ditemukan", 404);
            }
            return successResponse(res, null, "Tarif berhasil dihapus");
        });
    }

    // POST calculate (DENGAN service_type)
    calculate(req, res) {
        const validationError = validateCalculatePrice(req.body);
        if (validationError) return errorResponse(res, validationError, 400);

        const { courier_id, origin, destination, service_type, weight } = req.body;

        // Validasi service_type
        if (!service_type) {
            return errorResponse(res, "Service type wajib diisi", 400);
        }

        RateModel.calculatePrice(courier_id, origin, destination, service_type, weight, (err, totalPrice) => {
            if (err) return errorResponse(res, err, 500, "Gagal menghitung harga");
            if (totalPrice === null) {
                return errorResponse(res, "Tarif tidak ditemukan untuk rute dan layanan tersebut", 404);
            }

            return successResponse(
                res,
                { courier_id, origin, destination, service_type, weight, total_price: totalPrice },
                "Harga berhasil dihitung"
            );
        });
    }
}

module.exports = new RateController();