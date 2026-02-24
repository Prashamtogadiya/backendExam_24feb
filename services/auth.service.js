const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/user.model');

const loginUser = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;

  const payload = { id: user.id, email: user.email, role: (user.role || '').toUpperCase() };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

module.exports = { loginUser };

