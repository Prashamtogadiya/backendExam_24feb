const commentService = require('../services/comment.service');

const createComment = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    if (!ticketId) return res.status(400).json({ message: 'Invalid ticket id' });

    const { comment } = req.body; // validated by middleware
    if (!comment) return res.status(400).json({ message: 'comment is required' });

    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const result = await commentService.createComment({ ticketId, user, comment });
    if (result.status && result.status !== 201) return res.status(result.status).json({ message: result.message });

    return res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createComment };

const updateComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    if (!commentId) return res.status(400).json({ message: 'Invalid comment id' });

    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: 'comment is required' });

    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const commentUpdateService = require('../services/comment.update.service');
    const result = await commentUpdateService.updateComment({ commentId, user, comment });
    if (result.status && result.status !== 200) return res.status(result.status).json({ message: result.message });

    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createComment, updateComment };

const deleteComment = async (req, res) => {
  try {
    const commentId = Number(req.params.id);
    if (!commentId) return res.status(400).json({ message: 'Invalid comment id' });

    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const deleteService = require('../services/comment.delete.service');
    const result = await deleteService.deleteComment({ commentId, user });
    if (result.status === 204) return res.status(204).send();
    if (result.status) return res.status(result.status).json({ message: result.message });

    return res.status(500).json({ message: 'Internal server error' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createComment, updateComment, deleteComment };
