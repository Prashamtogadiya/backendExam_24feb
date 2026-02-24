const commentService = require('../services/comment.service');

const listComments = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    if (!ticketId) return res.status(400).json({ message: 'Invalid ticket id' });

    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const result = await commentService.listComments({ ticketId, user });
    if (result.status && result.status !== 200) return res.status(result.status).json({ message: result.message });

    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { listComments };
