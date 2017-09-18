const { Pool } = require('pg')
require('dotenv').config()
module.exports = {}

// DB CONNECT
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	ssl: true
})

module.exports.query = (query, values) => pool.query(query, values)
