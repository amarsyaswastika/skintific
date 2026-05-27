const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/database");

dotenv.config();

// BUAT APP TERLEBIH DAHULU
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// STATIC FILE SERVING
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// IMPORT ROUTES
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courierRoutes = require("./routes/couriers");
const rateRoutes = require("./routes/rates");
const shipmentRoutes = require("./routes/shipments");
const trackingRoutes = require("./routes/tracking");

// REGISTER ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/couriers", courierRoutes);
app.use("/rates", rateRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/tracking", trackingRoutes);

// ROOT ROUTE
app.get("/", (req, res) => {
    res.json({ message: "🚀 SwiftTrack API is running" });
});

// TEST DATABASE CONNECTION
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database connection failed", error: err.message });
        }
        res.json({ success: true, message: "Database connected" });
    });
});

// HEALTH CHECK
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server SwiftTrack berjalan" });
});

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// START SERVER - HAPUS db.connect() DI SINI
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log("📦 Database module loaded");
    // Koneksi database sudah di-handle di config/database.js
    // Jangan panggil db.connect() lagi
});