function errorResponse(res, error, status = 500, message = "Terjadi kesalahan") {
    console.error("❌ Error:", error);
    
    return res.status(status).json({
        success: false,
        status: "error",
        code: status,
        message: message,
        error: error?.message || error,
        timestamp: new Date().toISOString()
    });
}

function successResponse(res, data, message = "Berhasil", status = 200) {
    return res.status(status).json({
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    });
}

module.exports = { errorResponse, successResponse };
