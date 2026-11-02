
require('dotenv').config();

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log("Checking environment variables...");

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PASSWORD loaded:", !!process.env.DB_PASSWORD);

if (!process.env.DB_PASSWORD) {
    console.log("ERROR: Database password is missing!");
    process.exit(1);
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(
            path.join(__dirname, 'ca.pem')
        ),
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.log("Connection failed:", err.message);
    } else {
        console.log("MySQL Connected Successfully!");
    }

    connection.end();
});
