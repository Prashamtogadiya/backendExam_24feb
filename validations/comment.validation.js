const { z } = require('zod');

const createCommentSchema = z.object({
  comment: z.string().min(1),
});

module.exports = { createCommentSchema };
