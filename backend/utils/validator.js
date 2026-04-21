// ==================== VALIDASI ID ====================
function validateId(id) {
    if (!id || isNaN(id) || id <= 0) {
        return "ID tidak valid";
    }
    return null;
}
// ==================== VALIDASI COURIERS ====================
function validateCourier(data) {
    if (!data.vendor_name || data.vendor_name.trim() === "") {
        return "Nama vendor harus diisi";
    }
    if (data.vendor_name && data.vendor_name.length < 2) {
        return "Nama vendor minimal 2 karakter";
    }
    if (data.phone && !/^[0-9+\-\s()]+$/.test(data.phone)) {
        return "Format nomor telepon tidak valid";
    }
    return null;
}


// ==================== VALIDASI SHIPPING RATES ====================
function validateRate(data) {
    if (!data.courier_id || isNaN(data.courier_id)) {
        return "ID kurir harus diisi dan berupa angka";
    }
    if (!data.origin || data.origin.trim() === "") {
        return "Kota asal harus diisi";
    }
    if (!data.destination || data.destination.trim() === "") {
        return "Kota tujuan harus diisi";
    }
    if (!data.service_type || data.service_type.trim() === "") {
        return "Tipe layanan harus diisi";
    }
    const allowedServices = ["Reguler", "Express", "Same Day", "Cargo"];
    if (!allowedServices.includes(data.service_type)) {
        return "Tipe layanan harus: Reguler, Express, Same Day, Cargo";
    }
    if (!data.price_per_kg || isNaN(data.price_per_kg) || data.price_per_kg <= 0) {
        return "Harga per kg harus diisi dan berupa angka positif";
    }
    return null;
}

// ==================== VALIDASI SHIPMENTS ====================
function validateShipment(data) {
    if (!data.courier_id || isNaN(data.courier_id)) {
        return "ID kurir harus diisi dan berupa angka";
    }
    if (!data.tracking_number || data.tracking_number.trim() === "") {
        return "Nomor tracking harus diisi";
    }
    if (data.tracking_number && data.tracking_number.length < 5) {
        return "Nomor tracking minimal 5 karakter";
    }
    if (!data.sender_name || data.sender_name.trim() === "") {
        return "Nama pengirim harus diisi";
    }
    if (!data.receiver_name || data.receiver_name.trim() === "") {
        return "Nama penerima harus diisi";
    }
    return null;
}

function validateShipmentStatus(data) {
    if (!data.status || data.status.trim() === "") {
        return "Status harus diisi";
    }
    const allowedStatus = ["pending", "in-transit", "delivered", "cancelled"];
    if (!allowedStatus.includes(data.status)) {
        return "Status harus: pending, in-transit, delivered, cancelled";
    }
    return null;
}

// ==================== VALIDASI CALCULATE PRICE ====================
function validateCalculatePrice(data) {
    if (!data.courier_id || isNaN(data.courier_id)) {
        return "ID kurir harus diisi dan berupa angka";
    }
    if (!data.origin || data.origin.trim() === "") {
        return "Kota asal harus diisi";
    }
    if (!data.destination || data.destination.trim() === "") {
        return "Kota tujuan harus diisi";
    }
    if (!data.weight || isNaN(data.weight) || data.weight <= 0) {
        return "Berat harus diisi dan berupa angka positif";
    }
    return null;
}


module.exports = {
    validateId,
     validateCourier,
    validateShipment,
    validateShipmentStatus,
    validateRate,
    validateCalculatePrice
};

