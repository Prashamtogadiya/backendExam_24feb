const pool = require('../config/db');

async function createComment({ ticket_id, user_id, comment }) {
  const [result] = await pool.execute(
    'INSERT INTO ticket_comments (ticket_id, user_id, comment) VALUES (?, ?, ?)',
    [ticket_id, user_id, comment]
  );
  return result.insertId;
}

async function getById(id) {
  const [rows] = await pool.execute(
    `SELECT tc.id, tc.comment, tc.created_at,
      u.id AS user_id, u.name AS user_name, u.email AS user_email, r.id AS user_role_id, r.name AS user_role_name, u.created_at AS user_created_at
     FROM ticket_comments tc
     JOIN users u ON tc.user_id = u.id
     JOIN roles r ON u.role_id = r.id
     WHERE tc.id = ? LIMIT 1`,
    [id]
  );
  return rows[0];
}

async function listByTicket(ticketId) {
  const [rows] = await pool.execute(
    `SELECT tc.id, tc.comment, tc.created_at,
      u.id AS user_id, u.name AS user_name, u.email AS user_email, r.id AS user_role_id, r.name AS user_role_name, u.created_at AS user_created_at
     FROM ticket_comments tc
     JOIN users u ON tc.user_id = u.id
     JOIN roles r ON u.role_id = r.id
     WHERE tc.ticket_id = ?
     ORDER BY tc.created_at ASC`,
    [ticketId]
  );
  return rows;
}

module.exports = { createComment, getById, listByTicket };

async function updateComment(id, comment) {
  const [result] = await pool.execute('UPDATE ticket_comments SET comment = ? WHERE id = ?', [comment, id]);
  return result.affectedRows;
}

async function deleteComment(id) {
  const [result] = await pool.execute('DELETE FROM ticket_comments WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { createComment, getById, listByTicket, updateComment, deleteComment };

