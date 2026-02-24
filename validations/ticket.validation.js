const { z } = require('zod');

const createTicketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
});

const assignTicketSchema = z.object({
  userId: z.number().int().positive(),
});

module.exports = { createTicketSchema, assignTicketSchema };

const changeStatusSchema = z.object({
  status: z.enum(['OPEN','IN_PROGRESS','RESOLVED','CLOSED']),
});

module.exports = { createTicketSchema, assignTicketSchema, changeStatusSchema };
