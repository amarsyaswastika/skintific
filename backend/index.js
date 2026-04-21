const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");
const { testConnection } = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.json({ message: "🚀 SwiftTrack API is running" });
});

// Test database connection
app.get("/api/test-db", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database connection failed", error: err.message });
        }
        res.json({ success: true, message: "Database connected" });
    });
});

// =====================================================
// [SPRINT 4 & 5] ROUTES UTAMA API
// =====================================================

// [SPRINT 4] Import routes
const authRoutes = require("./routes/auth");
const courierRoutes = require("./routes/couriers");
const rateRoutes = require("./routes/rates");
const shipmentRoutes = require("./routes/shipments");
const trackingRoutes = require("./routes/tracking");

// [SPRINT 4 & 5] Register routes
app.use("/api/auth", authRoutes);        //  Validasi & Error Handler
app.use("/api/couriers", courierRoutes); // Validasi & Error Handler
app.use("/api/rates", rateRoutes);       // [SPRINT 5] + Validasi & Error Handler
app.use("/api/shipments", shipmentRoutes); // Validasi & Error Handler
app.use("/api/tracking", trackingRoutes);  // Validasi & Error Handler

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server SwiftTrack berjalan" });
});

// [SPRINT 5] 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    // [SPRINT 4] Test koneksi database saat server start
    db.connect((err) => {
        if (err) console.error("❌ Database connection failed:", err.message);
        else console.log("✅ Database connected");
    });
});

