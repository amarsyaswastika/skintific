// ==================== VALIDASI ID ====================
function validateId(id) {
  if (!id || isNaN(id) || id <= 0) {
    return "ID tidak valid";
  }
  return null;
}

// ==================== VALIDASI COURIER ====================
function validateCourier(data) {
  if (!data.vendor_name || data.vendor_name.trim() === "") {
    return "Nama vendor harus diisi";
  }
  if (data.vendor_name.length < 2) {
    return "Nama vendor minimal 2 karakter";
  }
  if (data.phone && !/^[0-9+\-\s()]+$/.test(data.phone)) {
    return "Format nomor telepon tidak valid";
  }
  return null;
}

// ==================== VALIDASI RATE ====================
function validateRate(data) {
  if (!data.courier_id || isNaN(data.courier_id)) {
    return "ID kurir harus berupa angka";
  }
  if (!data.origin) return "Kota asal harus diisi";
  if (!data.destination) return "Kota tujuan harus diisi";
  if (!data.service_type) return "Tipe layanan harus diisi";

  const allowed = ["Reguler", "Express", "Same Day", "Cargo"];
  if (!allowed.includes(data.service_type)) {
    return "Tipe layanan tidak valid";
  }

  if (!data.price_per_kg || isNaN(data.price_per_kg) || data.price_per_kg <= 0) {
    return "Harga harus angka positif";
  }

  return null;
}

// ==================== VALIDASI SHIPMENT ====================
function validateShipment(data) {
  if (!data.courier_id || isNaN(data.courier_id)) {
    return "ID kurir harus angka";
  }
  if (!data.tracking_number) return "Tracking number wajib";
  if (data.tracking_number.length < 5) return "Tracking minimal 5 karakter";
  if (!data.sender_name) return "Nama pengirim wajib";
  if (!data.receiver_name) return "Nama penerima wajib";

  return null;
}

// ==================== VALIDASI STATUS ====================
function validateShipmentStatus(data) {
  const allowed = ["pending", "in-transit", "delivered", "cancelled"];
  if (!data.status) return "Status wajib diisi";
  if (!allowed.includes(data.status)) return "Status tidak valid";
  return null;
}

// ==================== VALIDASI TRACKING ====================
function validateTracking(data) {
  if (!data.shipment_id || isNaN(data.shipment_id)) {
    return "Shipment ID tidak valid";
  }
  if (!data.status) return "Status wajib";

  const allowed = ["pending", "processing", "shipped", "in-transit", "delivered", "cancelled"];
  if (!allowed.includes(data.status)) return "Status tidak valid";

  return null;
}

// ==================== VALIDASI AUTH ====================
function validateRegister(data) {
  if (!data.name || data.name.length < 3) return "Nama minimal 3 karakter";
  if (!data.email) return "Email wajib";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) return "Email tidak valid";

  if (!data.password || data.password.length < 8) {
    return "Password minimal 8 karakter";
  }

  return null;
}

function validateLogin(data) {
  if (!data.email) return "Email wajib";
  if (!data.password) return "Password wajib";
  return null;
}

// ==================== VALIDASI CALCULATE ====================
function validateCalculatePrice(data) {
  if (!data.courier_id || isNaN(data.courier_id)) {
    return "Courier ID tidak valid";
  }
  if (!data.origin) return "Origin wajib";
  if (!data.destination) return "Destination wajib";
  if (!data.weight || isNaN(data.weight) || data.weight <= 0) {
    return "Weight harus angka positif";
  }

  return null;
}

// ==================== VALIDASI LOGO COURIER (SPRINT 7 - FILE UPLOAD) ====================//

function validateLogo(file) {
    // Logo bersifat optional (boleh tidak upload)
    if (!file) {
        return null;
    }
    
    // Validasi tipe file (hanya gambar)
    const allowedTypes = [
        "image/jpeg", 
        "image/jpg", 
        "image/png", 
        "image/gif", 
        "image/webp", 
        "image/svg+xml"
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
        return "Format logo harus JPG, PNG, GIF, WEBP, atau SVG";
    }
    
    // Validasi ukuran file (maksimal 2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        return "Ukuran logo maksimal 2MB";
    }
    
    return null;
}

// Update logo
 */
function validateLogoUpdate(file) {
    // Update boleh tanpa upload file baru
    if (!file) {
        return null;
    }
    
    // Jika ada file, validasi sama seperti validateLogo
    return validateLogo(file);
}

// ==================== EXPORT ====================
module.exports = {
  validateId,
  validateCourier,
  validateRate,
  validateShipment,
  validateShipmentStatus,
  validateTracking,
  validateRegister,
  validateLogo,
  validateLogoUpdate,
  validateLogin,
  validateCalculatePrice,
};