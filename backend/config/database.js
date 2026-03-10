// ============================================
// DATABASE CONNECTION CONFIGURATION
// ============================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Buat connection pool (koneksi yang bisa dipakai berulang)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'swifttrack_db',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,        // Tunggu kalau koneksi penuh
    connectionLimit: 10,              // Maksimal 10 koneksi bersamaan
    queueLimit: 0,                    // Tidak ada batas antrian
    enableKeepAlive: true,            // Jaga koneksi tetap hidup
    keepAliveInitialDelay: 0,          // Langsung aktifkan keep alive
    
    // Untuk cloud database (PlanetScale/Aiven) perlu SSL
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false      // Untuk PlanetScale
    } : false
});

// ============================================
// TEST KONEKSI DATABASE
// ============================================
const testConnection = async () => {
    console.log('🔄 Testing database connection...');
    
    try {
        // Ambil koneksi dari pool
        const connection = await pool.getConnection();
        
        console.log('✅ Database connected successfully!');
        
        // Test query sederhana
        const [rows] = await connection.query('SELECT NOW() as currentTime');
        console.log('🕒 Server time:', rows[0].currentTime);
        
        // Test cek database yang dipakai
        const [dbRows] = await connection.query('SELECT DATABASE() as dbName');
        console.log('📊 Database:', dbRows[0].dbName);
        
        // Kembalikan koneksi ke pool
        connection.release();
        
        return true;
        
    } catch (error) {
        console.error('❌ Database connection failed!');
        console.error('Error:', error.message);
        
        // Diagnostik error umum
        if (error.code === 'ECONNREFUSED') {
            console.error('💡 Tips: Pastikan MySQL/XAMPP sudah running');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('💡 Tips: Cek username/password di .env');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('💡 Tips: Database belum dibuat, jalankan: CREATE DATABASE ' + process.env.DB_NAME);
        } else if (error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            console.error('💡 Tips: Coba set DB_SSL=false di .env untuk localhost');
        }
        
        return false;
    }
};

// ============================================
// FUNGSI UTILITY UNTUK QUERY
// ============================================

// Fungsi untuk menjalankan query dengan error handling
const query = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return { success: true, data: rows, error: null };
    } catch (error) {
        console.error('Query error:', error.message);
        return { success: false, data: null, error: error.message };
    }
};

// Fungsi untuk mendapatkan satu baris data
const queryOne = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return { success: true, data: rows[0] || null, error: null };
    } catch (error) {
        console.error('Query error:', error.message);
        return { success: false, data: null, error: error.message };
    }
};

// Fungsi untuk insert dan return ID
const insert = async (sql, params = []) => {
    try {
        const [result] = await pool.execute(sql, params);
        return { 
            success: true, 
            insertId: result.insertId,
            affectedRows: result.affectedRows,
            error: null 
        };
    } catch (error) {
        console.error('Insert error:', error.message);
        return { success: false, insertId: null, affectedRows: 0, error: error.message };
    }
};

// ============================================
// EXPORT
// ============================================
module.exports = {
    pool,                // Connection pool langsung (kalau mau akses langsung)
    testConnection,      // Fungsi test koneksi
    query,               // Fungsi untuk SELECT
    queryOne,            // Fungsi untuk SELECT satu baris
    insert               // Fungsi untuk INSERT
};