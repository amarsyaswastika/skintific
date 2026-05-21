// ==================== VALIDASI ID ====================
function validateId(id) {
  if (!id || isNaN(id) || id <= 0) {
    return "ID tidak valid";
  }
  return null;
}

// ==================== VALIDASI COURIER (HANYA vendor_name & phone) ====================
function validateCourier(data) {
  // Cek data undefined/null
  if (!data) {
    return "Data tidak lengkap";
  }
  
  // Validasi vendor_name (wajib)
  if (!data.vendor_name || data.vendor_name.trim() === "") {
    return "Nama vendor harus diisi";
  }
  if (data.vendor_name.length < 2) {
    return "Nama vendor minimal 2 karakter";
  }
  
  // Validasi phone (opsional)
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
  if (!data) {
    return "Data tidak lengkap";
  }
  
  if (!data.name || data.name.trim() === "") {
    return "Nama harus diisi";
  }
  if (data.name.length < 3) {
    return "Nama minimal 3 karakter";
  }
  
  if (!data.email || data.email.trim() === "") {
    return "Email harus diisi";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return "Format email tidak valid";
  }
  
  if (!data.password) {
    return "Password harus diisi";
  }
  if (data.password.length < 6) {
    return "Password minimal 6 karakter";
  }

  return null;
}

function validateLogin(data) {
  if (!data || !data.email || data.email.trim() === "") {
    return "Email harus diisi";
  }
  if (!data.password) {
    return "Password harus diisi";
  }
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

// ==================== VALIDASI LOGO ====================
function validateLogo(file) {
  if (!file) return null;

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

  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    return "Ukuran logo maksimal 2MB";
  }

  return null;
}

// ==================== VALIDASI LOGO UPDATE ====================
function validateLogoUpdate(file) {
  if (!file) return null;
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
  validateLogin,
  validateCalculatePrice,
  validateLogo,
  validateLogoUpdate
};