const { Pool } = require("pg");
require("dotenv").config();

// PostgreSQL connection pool


const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "hotel_admin",
  password: process.env.DB_PASSWORD || "hotel_secure_password",
  database: process.env.DB_NAME || "hotel_db",
});

module.exports = pool;
