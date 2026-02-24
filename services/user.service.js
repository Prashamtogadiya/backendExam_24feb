const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const createUser = async ({ name, email, password, role }) => {
  // find role id
  const roleRow = await userModel.findRoleByName(role);
  if (!roleRow) throw new Error('Invalid role');

  const hashed = await bcrypt.hash(password, 10);
  const insertId = await userModel.createUser({ name, email, password: hashed, role_id: roleRow.id });

  const created = await userModel.getById(insertId);
  if (!created) return null;

  return {
    id: created.id,
    name: created.name,
    email: created.email,
    role: { id: created.role_id, name: created.role_name },
    created_at: created.created_at,
  };
};

const listUsers = async () => {
  const rows = await userModel.listUsers();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: { id: r.role_id, name: r.role_name },
    created_at: r.created_at,
  }));
};

module.exports = { createUser, listUsers };
