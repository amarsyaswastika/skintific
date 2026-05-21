const CourierModel = require("../models/CourierModel");
const { validateId, validateCourier, validateLogo } = require("../utils/validator");
const { errorResponse, successResponse } = require("../utils/errorHandler");
const fs = require("fs");
const path = require("path");

class CourierController {
  // GET all couriers
  index(req, res) {
    CourierModel.getAll((err, results) => {
      if (err) {
        return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const data = results.map(courier => ({
        ...courier,
        logo_url: courier.logo_url
          ? `${baseUrl}/uploads/logos/${courier.logo_url}`
          : null
      }));

      return successResponse(res, data, "Berhasil ambil data kurir");
    });
  }

  // GET courier by id
  show(req, res) {
    const idError = validateId(req.params.id);
    if (idError) {
      return errorResponse(res, idError, 400, idError);
    }

    CourierModel.getById(req.params.id, (err, results) => {
      if (err) {
        return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      }

      if (results.length === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const courier = {
        ...results[0],
        logo_url: results[0].logo_url
          ? `${baseUrl}/uploads/logos/${results[0].logo_url}`
          : null
      };

      return successResponse(res, courier, "Berhasil ambil data kurir");
    });
  }

  // POST create courier
  store(req, res) {
    console.log("Request body:", req.body); // Debug
    
    const validationError = validateCourier(req.body);
    if (validationError) {
      return errorResponse(res, validationError, 400, validationError);
    }

    const fileError = validateLogo(req.file);
    if (fileError) {
      return errorResponse(res, fileError, 400, fileError);
    }

    const courierData = { ...req.body };

    if (req.file) {
      courierData.logo_url = req.file.filename;
    }

    CourierModel.create(courierData, (err, result) => {
      if (err) {
        console.log("Error:", err); // Debug
        if (err.code === "ER_DUP_ENTRY") {
          return errorResponse(res, "Kurir sudah terdaftar", 409, "Data sudah ada");
        }
        return errorResponse(res, err, 500, "Gagal menambah kurir");
      }

      return successResponse(
        res,
        { id: result.insertId },
        "Kurir berhasil ditambahkan",
        201
      );
    });
  }

  // PUT update courier
  update(req, res) {
    const idError = validateId(req.params.id);
    if (idError) {
      return errorResponse(res, idError, 400, idError);
    }

    const validationError = validateCourier(req.body);
    if (validationError) {
      return errorResponse(res, validationError, 400, validationError);
    }

    const fileError = validateLogo(req.file);
    if (fileError) {
      return errorResponse(res, fileError, 400, fileError);
    }

    CourierModel.getById(req.params.id, (err, results) => {
      if (err) {
        return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      }

      if (results.length === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }

      const oldLogo = results[0].logo_url;
      const courierData = { ...req.body };

      if (req.file) {
        courierData.logo_url = req.file.filename;
      }

      CourierModel.update(req.params.id, courierData, (err, result) => {
        if (err) {
          return errorResponse(res, err, 500, "Gagal update kurir");
        }

        // Hapus logo lama jika upload baru
        if (req.file && oldLogo) {
          const oldLogoPath = path.join(__dirname, "../uploads/logos", oldLogo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }

        return successResponse(res, null, "Kurir berhasil diupdate");
      });
    });
  }

  // DELETE courier
  destroy(req, res) {
    const idError = validateId(req.params.id);
    if (idError) {
      return errorResponse(res, idError, 400, idError);
    }

    CourierModel.getById(req.params.id, (err, results) => {
      if (err) {
        return errorResponse(res, err, 500, "Gagal mengambil data kurir");
      }

      if (results.length === 0) {
        return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
      }

      const logoToDelete = results[0].logo_url;

      CourierModel.delete(req.params.id, (err, result) => {
        if (err) {
          return errorResponse(res, err, 500, "Gagal hapus kurir");
        }

        if (result.affectedRows === 0) {
          return errorResponse(res, "Kurir tidak ditemukan", 404, "Kurir tidak ditemukan");
        }

        // Hapus file logo
        if (logoToDelete) {
          const logoPath = path.join(__dirname, "../uploads/logos", logoToDelete);
          if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath);
          }
        }

        return successResponse(res, null, "Kurir berhasil dihapus");
      });
    });
  }
}

module.exports = new CourierController();