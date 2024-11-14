// db.js
const { Pool } = require('pg');

// Database connection settings
const pool = new Pool({
  user: 'test',
  host: 'db', 
  database: 'test',
  password: 'test',
  port: 5432,
});

module.exports = pool;

