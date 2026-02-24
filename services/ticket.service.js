const ticketModel = require('../models/ticket.model');
const userModel = require('../models/user.model');


const createTicket = async ({ title, description, priority, createdById }) => {
  const insertId = await ticketModel.createTicket({ title, description, priority, created_by: createdById });
  const row = await ticketModel.getById(insertId);
  if (!row) return null;

  const formatUser = (prefix) => {
    if (!row[`${prefix}_id`]) return null;
    return {
      id: row[`${prefix}_id`],
      name: row[`${prefix}_name`],
      email: row[`${prefix}_email`],
      role: { id: row[`${prefix}_role_id`], name: row[`${prefix}_role_name`] },
      created_at: row[`${prefix}_created_at`],
    };
  };

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    created_by: formatUser('created_by'),
    assigned_to: formatUser('assigned_to'),
    created_at: row.created_at,
  };
};

const assignTicket = async ({ ticketId, userId }) => {
  // verify ticket exists
  const existing = await ticketModel.getById(ticketId);
  if (!existing) return { status: 404, message: 'Ticket not found' };

  // verify user exists
  const assignee = await userModel.getById(userId);
  if (!assignee) return { status: 404, message: 'User not found' };

  // perform update
  const affected = await ticketModel.assignTicket(ticketId, userId);
  if (!affected) return { status: 400, message: 'Could not assign ticket' };

  const updated = await ticketModel.getById(ticketId);
  if (!updated) return { status: 500, message: 'Failed to fetch updated ticket' };

  const formatUser = (prefix) => {
    if (!updated[`${prefix}_id`]) return null;
    return {
      id: updated[`${prefix}_id`],
      name: updated[`${prefix}_name`],
      email: updated[`${prefix}_email`],
      role: { id: updated[`${prefix}_role_id`], name: updated[`${prefix}_role_name`] },
      created_at: updated[`${prefix}_created_at`],
    };
  };

  return {
    status: 200,
    data: {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      created_by: formatUser('created_by'),
      assigned_to: formatUser('assigned_to'),
      created_at: updated.created_at,
    },
  };
};

const listTickets = async (user) => {
  let rows = [];
  if (user.role === 'MANAGER') {
    rows = await ticketModel.listAllTickets();
  } else if (user.role === 'SUPPORT') {
    rows = await ticketModel.listTicketsAssignedTo(user.id);
  } else if (user.role === 'USER') {
    rows = await ticketModel.listTicketsCreatedBy(user.id);
  } else {
    return [];
  }

  const formatRow = (row) => {
    const formatUser = (prefix) => {
      if (!row[`${prefix}_id`]) return null;
      return {
        id: row[`${prefix}_id`],
        name: row[`${prefix}_name`],
        email: row[`${prefix}_email`],
        role: { id: row[`${prefix}_role_id`], name: row[`${prefix}_role_name`] },
        created_at: row[`${prefix}_created_at`],
      };
    };

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      created_by: formatUser('created_by'),
      assigned_to: formatUser('assigned_to'),
      created_at: row.created_at,
    };
  };

  return rows.map(formatRow);
};

const changeStatus = async ({ ticketId, status, changedBy }) => {
  const existing = await ticketModel.getById(ticketId);
  if (!existing) return { status: 404, message: 'Ticket not found' };

  // perform update + log
  const res = await ticketModel.updateStatusWithLog(ticketId, status, changedBy);
  if (!res || res.affected === 0) return { status: 400, message: 'Could not update status' };

  const updated = await ticketModel.getById(ticketId);
  if (!updated) return { status: 500, message: 'Failed to fetch updated ticket' };

  const formatUser = (prefix) => {
    if (!updated[`${prefix}_id`]) return null;
    return {
      id: updated[`${prefix}_id`],
      name: updated[`${prefix}_name`],
      email: updated[`${prefix}_email`],
      role: { id: updated[`${prefix}_role_id`], name: updated[`${prefix}_role_name`] },
      created_at: updated[`${prefix}_created_at`],
    };
  };

  return {
    status: 200,
    data: {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      created_by: formatUser('created_by'),
      assigned_to: formatUser('assigned_to'),
      created_at: updated.created_at,
    },
  };
};

const deleteTicket = async ({ ticketId }) => {
  const existing = await ticketModel.getById(ticketId);
  if (!existing) return { status: 404, message: 'Ticket not found' };

  const affected = await ticketModel.deleteTicket(ticketId);
  if (!affected) return { status: 400, message: 'Could not delete ticket' };

  return { status: 204 };
};

module.exports = { createTicket, assignTicket, listTickets, changeStatus, deleteTicket };
