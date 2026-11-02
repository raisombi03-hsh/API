
const mysql2 = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const poolConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(
            path.join(__dirname, '../ca.pem')
        ),
        rejectUnauthorized: true
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql2.createPool(poolConfig);

module.exports = pool;
