// ============================================
// TEST DATABASE CONNECTION
// ============================================
// Cara pakai: node test-connection.js
// Atau: npm run test-db

require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('\n🔌 TESTING DATABASE CONNECTION');
    console.log('================================');
    
    // Tampilkan konfigurasi (tanpa password)
    console.log('📋 Configuration:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || '3306'}`);
    console.log(`   User: ${process.env.DB_USER || 'root'}`);
    console.log(`   Database: ${process.env.DB_NAME || 'swifttrack_db'}`);
    console.log(`   SSL: ${process.env.DB_SSL || 'false'}`);
    console.log('================================');

    try {
        // Buat koneksi
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'swifttrack_db',
            port: process.env.DB_PORT || 3306,
            ssl: process.env.DB_SSL === 'true' ? {
                rejectUnauthorized: false
            } : false
        });

        console.log('✅ SUCCESS: Connected to database!\n');

        // Test query 1: Current time
        const [timeResult] = await connection.query('SELECT NOW() as currentTime');
        console.log(`🕒 Server time: ${timeResult[0].currentTime}`);

        // Test query 2: Cek tabel yang ada
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`\n📋 Tables in database (${tables.length}):`);
        
        if (tables.length === 0) {
            console.log('   - No tables yet. Run migration first: npm run migrate');
        } else {
            tables.forEach((table, index) => {
                const tableName = Object.values(table)[0];
                console.log(`   ${index + 1}. ${tableName}`);
            });
        }

        // Test query 3: Cek jumlah data per tabel (kalau ada)
        if (tables.length > 0) {
            console.log('\n📊 Row counts:');
            
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                console.log(`   ${tableName}: ${countResult[0].count} rows`);
            }
        }

        // Tutup koneksi
        await connection.end();
        console.log('\n✅ Connection closed successfully');
        
    } catch (error) {
        console.error('\n❌ ERROR: Failed to connect to database');
        console.error('   Message:', error.message);
        
        // Diagnostik error umum
        if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Tips:');
            console.error('   - Pastikan MySQL/XAMPP sudah running');
            console.error('   - Cek port (default 3306)');
            console.error('   - Cek host (localhost untuk XAMPP)');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Tips:');
            console.error('   - Cek username dan password di .env');
            console.error('   - Default XAMPP: user=root, password= (kosong)');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('\n💡 Tips:');
            console.error('   - Database belum dibuat');
            console.error('   - Jalankan: CREATE DATABASE swifttrack_db;');
        } else if (error.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
            console.error('\n💡 Tips:');
            console.error('   - SSL error, coba set DB_SSL=false di .env');
        }
    }
}

// Jalankan test
testConnection();