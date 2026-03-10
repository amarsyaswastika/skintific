const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: '🚀 SwiftTrack API is running' });
});

app.get('/api/test-db', async (req, res) => {
    const isConnected = await testConnection();
    res.json({ success: isConnected });
});

// Test routes
const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    testConnection();
});