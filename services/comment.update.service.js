const commentModel = require('../models/comment.model');
const userModel = require('../models/user.model');

const updateComment = async ({ commentId, user, comment }) => {
  const existing = await commentModel.getById(commentId);
  if (!existing) return { status: 404, message: 'Comment not found' };

  // RBAC: authoritative check — re-fetch acting user from DB to avoid trusting token payload
  if (!user || !user.id) return { status: 401, message: 'Unauthorized' };
  const acting = await userModel.getById(Number(user.id));
  const actingRole = (acting && acting.role_name) ? String(acting.role_name).toUpperCase() : '';
  const isManager = actingRole === 'MANAGER';
  const isAuthor = Number(existing.user_id) === Number(user.id);
  if (!isManager || !isAuthor) {
    return { status: 403, message: 'Forbidden' };
  }

  const affected = await commentModel.updateComment(commentId, comment);
  if (!affected) return { status: 400, message: 'Could not update comment' };

  const updated = await commentModel.getById(commentId);
  if (!updated) return { status: 500, message: 'Failed to fetch updated comment' };

  return {
    status: 200,
    data: {
      id: updated.id,
      comment: updated.comment,
      user: {
        id: updated.user_id,
        name: updated.user_name,
        email: updated.user_email,
        role: { id: updated.user_role_id, name: updated.user_role_name },
        created_at: updated.user_created_at,
      },
      created_at: updated.created_at,
    },
  };
};

module.exports = { updateComment };
