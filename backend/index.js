const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
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
app.get("/api/test-db", async (req, res) => {
    const isConnected = await testConnection();
    res.json({ success: isConnected });
});

// =====================================================
// ROUTES UTAMA API
// =====================================================

// Import routes
const authRoutes = require("./routes/auth");
const courierRoutes = require("./routes/couriers");
const rateRoutes = require("./routes/rates");
const shipmentRoutes = require("./routes/shipments");
const trackingRoutes = require("./routes/tracking");
const testRoutes = require("./routes/testRoutes");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/test", testRoutes);

// Health check route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server SwiftTrack berjalan" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    testConnection();
});