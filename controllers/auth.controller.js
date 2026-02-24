const { success } = require('zod');
const authService = require('../services/auth.service');

const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.loginUser(email, password);
  if (!token) return res.status(401).json({success:false, message: 'Unauthorized' });

  return res.status(200).json({ token });
};

module.exports = { login };

