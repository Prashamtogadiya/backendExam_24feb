const commentModel = require('../models/comment.model');
const userModel = require('../models/user.model');

const deleteComment = async ({ commentId, user }) => {
  const existing = await commentModel.getById(commentId);
  if (!existing) return { status: 404, message: 'Comment not found' };

  if (!user || !user.id) return { status: 401, message: 'Unauthorized' };
  const acting = await userModel.getById(Number(user.id));
  const actingRole = (acting && acting.role_name) ? String(acting.role_name).toUpperCase() : '';
  const isManager = actingRole === 'MANAGER';
  const isAuthor = Number(existing.user_id) === Number(user.id);
  if (!isManager && !isAuthor) return { status: 403, message: 'Forbidden' };

  const affected = await commentModel.deleteComment(commentId);
  if (!affected) return { status: 400, message: 'Could not delete comment' };

  return { status: 204 };
};

module.exports = { deleteComment };
