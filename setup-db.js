// require('dotenv').config({ path: '.env' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log('Starting database setup...');

    // Connection config without database selected initally
    const config = {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        multipleStatements: true // Allow running multiple queries
    };

    const dbName = process.env.MYSQL_DATABASE;

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL server.');

        // Create database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);

        // Use the database
        await connection.changeUser({ database: dbName });
        console.log(`Switched to database '${dbName}'.`);

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await connection.query(schema);
        console.log('Schema executed successfully.');

        // Read and execute seed
        const seedPath = path.join(__dirname, 'db', 'question_bank_seed.sql');
        let seed = fs.readFileSync(seedPath, 'utf8');

        // Fix wrong USE statement in seed file if present
        seed = seed.replace(/USE\s+tapasya;/i, `USE \`${dbName}\`;`);

        await connection.query(seed);
        console.log('Seed data executed successfully.');

        await connection.end();
        console.log('Database setup complete.');

    } catch (err) {
        console.error('Database setup failed:', err);
        process.exit(1);
    }
}

setupDatabase();
