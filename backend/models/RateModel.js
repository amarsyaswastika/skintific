const db = require("../config/database");

class RateModel {
    // Get all rates
    static getAll(callback) {
        db.query(`SELECT sr.*, c.vendor_name as courier_name 
              FROM shipping_rates sr 
              JOIN couriers c ON sr.courier_id = c.id`, callback);
    }

    // Get rate by ID
    static getById(id, callback) {
        db.query(`SELECT sr.*, c.vendor_name as courier_name 
              FROM shipping_rates sr 
              JOIN couriers c ON sr.courier_id = c.id 
              WHERE sr.id = ?`, [id], callback);
    }

    // Get rates by route
    static getByRoute(origin, destination, callback) {
        db.query(`SELECT sr.*, c.vendor_name as courier_name 
              FROM shipping_rates sr 
              JOIN couriers c ON sr.courier_id = c.id 
              WHERE sr.origin = ? AND sr.destination = ? 
              ORDER BY sr.price_per_kg ASC`, [origin, destination], callback);
    }

    // Get rates by courier
    static getByCourier(courierId, callback) {
        db.query(`SELECT sr.*, c.vendor_name as courier_name 
              FROM shipping_rates sr 
              JOIN couriers c ON sr.courier_id = c.id 
              WHERE sr.courier_id = ?`, [courierId], callback);
    }

    // Create new rate
    static create(data, callback) {
        const sql = `INSERT INTO shipping_rates (courier_id, origin, destination, service_type, price_per_kg) 
                 VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [data.courier_id, data.origin, data.destination, data.service_type, data.price_per_kg], callback);
    }

    // Update rate
    static update(id, data, callback) {
        const sql = `UPDATE shipping_rates SET courier_id = ?, origin = ?, destination = ?, 
                 service_type = ?, price_per_kg = ? WHERE id = ?`;
        db.query(sql, [data.courier_id, data.origin, data.destination, data.service_type, data.price_per_kg, id], callback);
    }

    // Delete rate
    static delete(id, callback) {
        db.query("DELETE FROM shipping_rates WHERE id = ?", [id], callback);
    }

    // Calculate price
    static calculatePrice(courierId, origin, destination, weight, callback) {
        const sql = `SELECT price_per_kg 
                 FROM shipping_rates 
                 WHERE courier_id = ? AND origin = ? AND destination = ? 
                 LIMIT 1`;
        db.query(sql, [courierId, origin, destination], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, null);

            const totalPrice = parseFloat(results[0].price_per_kg) * weight;
            callback(null, totalPrice);
        });
    }
}

module.exports = RateModel;