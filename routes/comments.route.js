const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createCommentSchema } = require('../validations/comment.validation');
const commentController = require('../controllers/comment.controller');

// Update a comment (MANAGER or author)
router.patch('/:id', authenticateJWT, validate(createCommentSchema), commentController.updateComment);

// Delete a comment (MANAGER or author)
router.delete('/:id', authenticateJWT, commentController.deleteComment);

module.exports = router;
