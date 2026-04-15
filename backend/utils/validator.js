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
module.exports = {
    validateId,
    validateShipment,
    validateShipmentStatus
};
