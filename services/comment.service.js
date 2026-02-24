const commentModel = require('../models/comment.model');
const ticketModel = require('../models/ticket.model');

const createComment = async ({ ticketId, user, comment }) => {
  const ticket = await ticketModel.getById(ticketId);
  if (!ticket) return { status: 404, message: 'Ticket not found' };

  // RBAC: MANAGER always; SUPPORT only if assigned; USER only if owner
  if (user.role === 'MANAGER') {
    // allowed
  } else if (user.role === 'SUPPORT') {
    if (!ticket.assigned_to_id || ticket.assigned_to_id !== user.id) return { status: 403, message: 'Forbidden' };
  } else if (user.role === 'USER') {
    if (ticket.created_by_id !== user.id) return { status: 403, message: 'Forbidden' };
  } else {
    return { status: 403, message: 'Forbidden' };
  }

  const insertId = await commentModel.createComment({ ticket_id: ticketId, user_id: user.id, comment });
  const row = await commentModel.getById(insertId);
  if (!row) return { status: 500, message: 'Failed to fetch comment' };

  return {
    status: 201,
    data: {
      id: row.id,
      comment: row.comment,
      user: {
        id: row.user_id,
        name: row.user_name,
        email: row.user_email,
        role: { id: row.user_role_id, name: row.user_role_name },
        created_at: row.user_created_at,
      },
      created_at: row.created_at,
    },
  };
};

const listComments = async ({ ticketId, user }) => {
  const ticket = await ticketModel.getById(ticketId);
  if (!ticket) return { status: 404, message: 'Ticket not found' };

  // RBAC similar checks
  if (user.role === 'MANAGER') {
    // allowed
  } else if (user.role === 'SUPPORT') {
    if (!ticket.assigned_to_id || ticket.assigned_to_id !== user.id) return { status: 403, message: 'Forbidden' };
  } else if (user.role === 'USER') {
    if (ticket.created_by_id !== user.id) return { status: 403, message: 'Forbidden' };
  } else {
    return { status: 403, message: 'Forbidden' };
  }

  const rows = await commentModel.listByTicket(ticketId);
  const data = rows.map((row) => ({
    id: row.id,
    comment: row.comment,
    user: {
      id: row.user_id,
      name: row.user_name,
      email: row.user_email,
      role: { id: row.user_role_id, name: row.user_role_name },
      created_at: row.user_created_at,
    },
    created_at: row.created_at,
  }));

  return { status: 200, data };
};

module.exports = { createComment, listComments };
