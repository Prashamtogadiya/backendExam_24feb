const pool = require('../config/db'); // mysql2/promise pool

async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.password, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ? LIMIT 1`,
    [email]
  );
  return rows[0];
}

async function findRoleByName(name) {
  const [rows] = await pool.execute('SELECT id, name FROM roles WHERE name = ? LIMIT 1', [name]);
  return rows[0];
}

async function createUser({ name, email, password, role_id }) {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
    [name, email, password, role_id]
  );
  return result.insertId;
}

async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, r.id AS role_id, r.name AS role_name, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
}

async function listUsers() {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, r.id AS role_id, r.name AS role_name, u.created_at
     FROM users u
     JOIN roles r ON u.role_id = r.id
     ORDER BY u.created_at DESC`
  );
  return rows;
}

module.exports = { findByEmail, findRoleByName, createUser, getById, listUsers };