const mysql = require('mysql2')
require('dotenv').config();

const conn = () => { 
    const connect =  mysql.createConnection(process.env.DATABASE_URL);
    return connect
}

module.exports = {
    conn
}