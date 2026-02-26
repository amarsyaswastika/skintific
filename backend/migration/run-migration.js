const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
    console.log('🚀 RUNNING DATABASE MIGRATIONS...');
    console.log('====================================');
    
    // Urutan migration (sesuai dependency foreign key)
    const migrations = [
        '01_create_users_table.sql',
        '02_create_couriers_table.sql',
        '03_create_shipping_rates_table.sql',
        '04_create_shipments_table.sql',
        '05_create_tracking_timeline_table.sql'
    ];

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'swifttrack_db',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });

        console.log('✅ Connected to database\n');

        for (const migrationFile of migrations) {
            console.log(`📄 Running: ${migrationFile}`);
            
            const filePath = path.join(__dirname, migrationFile);
            const sqlScript = fs.readFileSync(filePath, 'utf8');
            
            if (sqlScript.trim()) {
                await connection.query(sqlScript);
                console.log(`✅ Success: ${migrationFile}\n`);
            } else {
                console.log(`⚠️  Warning: ${migrationFile} is empty\n`);
            }
        }

        const [tables] = await connection.query('SHOW TABLES');
        console.log('====================================');
        console.log(`📋 Tables in database (${tables.length}):`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
        });

        console.log('\n🎉 ALL MIGRATIONS COMPLETED!');
        await connection.end();
        
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
    }
}

runMigrations();