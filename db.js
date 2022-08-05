const mysql = require('mysql2')
require('dotenv').config();

const conn =  mysql.createConnection(process.env.DATABASE_URL);

module.exports = {
    conn
}