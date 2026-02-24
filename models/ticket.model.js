const pool = require('../config/db');

async function createTicket({ title, description, priority, created_by }) {
  const [result] = await pool.execute(
    'INSERT INTO tickets (title, description, priority, created_by) VALUES (?, ?, ?, ?)',
    [title, description, priority, created_by]
  );
  return result.insertId;
}

async function assignTicket(ticketId, userId) {
  const [result] = await pool.execute(
    'UPDATE tickets SET assigned_to = ? WHERE id = ?',
    [userId, ticketId]
  );
  return result.affectedRows;
}

async function updateStatusWithLog(ticketId, newStatus, changedBy) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute('SELECT status FROM tickets WHERE id = ? FOR UPDATE', [ticketId]);
    if (!rows || rows.length === 0) {
      await conn.rollback();
      conn.release();
      return { affected: 0, oldStatus: null };
    }
    const oldStatus = rows[0].status;
    await conn.execute('UPDATE tickets SET status = ? WHERE id = ?', [newStatus, ticketId]);
    await conn.execute('INSERT INTO ticket_status_logs (ticket_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)', [ticketId, oldStatus, newStatus, changedBy]);
    await conn.commit();
    conn.release();
    return { affected: 1, oldStatus };
  } catch (err) {
    try { await conn.rollback(); } catch (e) {}
    conn.release();
    throw err;
  }
}

async function listAllTickets() {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at,
      cu.id AS created_by_id, cu.name AS created_by_name, cu.email AS created_by_email, r1.id AS created_by_role_id, r1.name AS created_by_role_name, cu.created_at AS created_by_created_at,
      au.id AS assigned_to_id, au.name AS assigned_to_name, au.email AS assigned_to_email, r2.id AS assigned_to_role_id, r2.name AS assigned_to_role_name, au.created_at AS assigned_to_created_at
     FROM tickets t
     JOIN users cu ON t.created_by = cu.id
     JOIN roles r1 ON cu.role_id = r1.id
     LEFT JOIN users au ON t.assigned_to = au.id
     LEFT JOIN roles r2 ON au.role_id = r2.id
     ORDER BY t.created_at DESC`
  );
  return rows;
}

async function listTicketsAssignedTo(userId) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at,
      cu.id AS created_by_id, cu.name AS created_by_name, cu.email AS created_by_email, r1.id AS created_by_role_id, r1.name AS created_by_role_name, cu.created_at AS created_by_created_at,
      au.id AS assigned_to_id, au.name AS assigned_to_name, au.email AS assigned_to_email, r2.id AS assigned_to_role_id, r2.name AS assigned_to_role_name, au.created_at AS assigned_to_created_at
     FROM tickets t
     JOIN users cu ON t.created_by = cu.id
     JOIN roles r1 ON cu.role_id = r1.id
     JOIN users au ON t.assigned_to = au.id
     JOIN roles r2 ON au.role_id = r2.id
     WHERE t.assigned_to = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return rows;
}

async function listTicketsCreatedBy(userId) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at,
      cu.id AS created_by_id, cu.name AS created_by_name, cu.email AS created_by_email, r1.id AS created_by_role_id, r1.name AS created_by_role_name, cu.created_at AS created_by_created_at,
      au.id AS assigned_to_id, au.name AS assigned_to_name, au.email AS assigned_to_email, r2.id AS assigned_to_role_id, r2.name AS assigned_to_role_name, au.created_at AS assigned_to_created_at
     FROM tickets t
     JOIN users cu ON t.created_by = cu.id
     JOIN roles r1 ON cu.role_id = r1.id
     LEFT JOIN users au ON t.assigned_to = au.id
     LEFT JOIN roles r2 ON au.role_id = r2.id
     WHERE t.created_by = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );
  return rows;
}

async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT t.id, t.title, t.description, t.status, t.priority, t.created_at,
      cu.id AS created_by_id, cu.name AS created_by_name, cu.email AS created_by_email, r1.id AS created_by_role_id, r1.name AS created_by_role_name, cu.created_at AS created_by_created_at,
      au.id AS assigned_to_id, au.name AS assigned_to_name, au.email AS assigned_to_email, r2.id AS assigned_to_role_id, r2.name AS assigned_to_role_name, au.created_at AS assigned_to_created_at
     FROM tickets t
     JOIN users cu ON t.created_by = cu.id
     JOIN roles r1 ON cu.role_id = r1.id
     LEFT JOIN users au ON t.assigned_to = au.id
     LEFT JOIN roles r2 ON au.role_id = r2.id
     WHERE t.id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
}

async function deleteTicket(id) {
  const [result] = await pool.execute('DELETE FROM tickets WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { createTicket, assignTicket, updateStatusWithLog, getById, listAllTickets, listTicketsAssignedTo, listTicketsCreatedBy, deleteTicket };
