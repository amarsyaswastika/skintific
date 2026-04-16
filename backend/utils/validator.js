// ==================== VALIDASI ID ====================
function validateId(id) {
    if (!id || isNaN(id) || id <= 0) {
        return "ID tidak valid";
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

// ==================== VALIDASI TRACKING ====================
function validateTracking(data) {
    if (!data.shipment_id || isNaN(data.shipment_id)) {
        return "ID pengiriman harus diisi dan berupa angka";
    }
    if (!data.status || data.status.trim() === "") {
        return "Status harus diisi";
    }
    const allowedStatus = ["pending", "processing", "shipped", "in-transit", "delivered", "cancelled"];
    if (!allowedStatus.includes(data.status)) {
        return "Status tidak valid";
    }
    if (data.location && data.location.length > 100) {
        return "Lokasi maksimal 100 karakter";
    }
    if (data.description && data.description.length > 255) {
        return "Deskripsi maksimal 255 karakter";
    }
    return null;
}

module.exports = {
    validateId,
    validateShipment,
    validateTracking,
    validateShipmentStatus
};
