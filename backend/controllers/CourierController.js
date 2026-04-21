const CourierModel = require("../models/CourierModel");
const { validateId, validateCourier } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");

class CourierController {
  // GET all couriers
  index(req, res) {
    CourierModel.getAll((err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      successResponse(res, results, "Berhasil ambil data kurir");
    });
  }

  // GET courier by id
  show(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    CourierModel.getById(req.params.id, (err, results) => {
      if (err) return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      if (results.length === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }
      successResponse(res, results[0], "Berhasil ambil data kurir");
    });
  }

  // POST create courier
  store(req, res) {
    const validationError = validateCourier(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    CourierModel.create(req.body, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return errorResponse(res, "Kode kurir sudah terdaftar", 409, "Data sudah ada");
        }
        return errorResponse(res, err, 500, "Gagal menambah kurir");
      }
      successResponse(res, { id: result.insertId }, "Kurir berhasil ditambahkan", 201);
    });
  }

  // PUT update courier
  update(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    const validationError = validateCourier(req.body);
    if (validationError) return errorResponse(res, validationError, 400, validationError);

    CourierModel.update(req.params.id, req.body, (err, result) => {
      if (err) return errorResponse(res, err, 500, "Gagal update kurir");
      if (result.affectedRows === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }
      successResponse(res, null, "Kurir berhasil diupdate");
    });
  }

  // DELETE courier
  destroy(req, res) {
    const idError = validateId(req.params.id);
    if (idError) return errorResponse(res, idError, 400, idError);

    CourierModel.delete(req.params.id, (err, result) => {
      if (err) return errorResponse(res, err, 500, "Gagal hapus kurir");
      if (result.affectedRows === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }
      successResponse(res, null, "Kurir berhasil dihapus");
    });
  }
}

module.exports = new CourierController();

