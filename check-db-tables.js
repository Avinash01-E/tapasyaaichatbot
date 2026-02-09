const mysql = require('mysql2/promise');

async function checkTables() {
    console.log('Checking database tables...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        const [tables] = await connection.execute('SHOW TABLES');
        console.log('Tables found:', tables.map(t => Object.values(t)[0]));

        const [qbCount] = await connection.execute('SELECT COUNT(*) as count FROM question_bank');
        console.log(`question_bank rows: ${qbCount[0].count}`);

        const [kbCount] = await connection.execute('SELECT COUNT(*) as count FROM knowledge_base');
        console.log(`knowledge_base rows: ${kbCount[0].count}`);

        const [msgCount] = await connection.execute('SELECT COUNT(*) as count FROM chat_messages');
        console.log(`chat_messages rows: ${msgCount[0].count}`);

        await connection.end();
    } catch (err) {
        console.error('Check failed:', err);
    }
}

checkTables();
