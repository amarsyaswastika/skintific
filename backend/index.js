const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courierRoutes = require("./routes/couriers");
const rateRoutes = require("./routes/rates");
const shipmentRoutes = require("./routes/shipments");
const trackingRoutes = require("./routes/tracking");
const testRoutes = require("./routes/testRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/couriers", courierRoutes);
app.use("/api/rates", rateRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/test", testRoutes);

// Routes
app.get("/", (req, res) => {
    res.json({ message: "🚀 SwiftTrack API is running" });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server SwiftTrack berjalan" });
});

app.get("/api/test-db", async (req, res) => {
    const isConnected = await testConnection();
    res.json({ success: isConnected });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    testConnection();
});