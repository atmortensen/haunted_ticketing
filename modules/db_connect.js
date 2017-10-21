const { Pool } = require('pg')
require('dotenv').config()
module.exports = {}

// DB CONNECT
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: true
})

module.exports.query = (query, values) => pool.query(query, values)
