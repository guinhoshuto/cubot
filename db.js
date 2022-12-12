const mysql = require('mysql2/promise')
require('dotenv').config();

const conn = async () => { 
    const connect = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('conectou com o banco')
    return connect
}
// const conn =  mysql.createConnection(process.env.DATABASE_URL);
    // const connect =  mysql.createPool(process.env.DATABASE_URL);

module.exports = conn