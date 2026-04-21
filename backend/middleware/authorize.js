const errorHandler = require("../utils/errorHandler");

// [SPRINT 6] Middleware untuk multiple roles
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return errorHandler(res, "Forbidden", 403, "Tidak Ada Akses");
        }
        next();
    };
}

module.exports = authorize;
