const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcrypt');

async function createUser({ name, email, password, roleName = 'USER' }) {
  const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Prasham@2006",
    database: "support_ticket_db",
    port: Number(process.env.DATABASE_PORT || 3306),
  });

  const hashed = await bcrypt.hash(password, 10);
  const conn = await pool.getConnection();
  try {
    const [roleRows] = await conn.execute('SELECT id FROM roles WHERE name = ? LIMIT 1', [roleName]);
    if (!roleRows[0]) throw new Error('role not found');
    const roleId = roleRows[0].id;
    await conn.execute(
      'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
      [name, email, hashed, roleId]
    );
    console.log('User created');
  } finally {
    conn.release();
    await pool.end();
  }
}

// run example (change values)
createUser({ name: 'Test', email: 'test2@gmail.com', password: 'Test@123', roleName: 'USER' })
  .catch(err => { console.error(err); process.exit(1); });