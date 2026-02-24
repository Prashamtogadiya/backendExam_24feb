const userService = require('../services/user.service');

const createUser = async (req, res) => {
  try {
    const payload = req.body; // validated by middleware
    const created = await userService.createUser(payload);
    if (!created) return res.status(400).json({ message: 'Bad request' });
    return res.status(201).json(created);
  } catch (err) {
    if (err.message === 'Invalid role') return res.status(400).json({ message: 'Invalid role' });
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const listUsers = async (req, res) => {
  try {
    const list = await userService.listUsers();
    return res.status(200).json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, listUsers };
