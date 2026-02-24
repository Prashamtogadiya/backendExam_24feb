const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createTicketSchema } = require('../validations/ticket.validation');
const ticketController = require('../controllers/ticket.controller');
const { changeStatusSchema } = require('../validations/ticket.validation');
const { assignTicketSchema } = require('../validations/ticket.validation');
const { createCommentSchema } = require('../validations/comment.validation');
const commentController = require('../controllers/comment.controller');

// USER and MANAGER can create tickets
router.post('/', authenticateJWT, authorizeRoles('USER', 'MANAGER'), validate(createTicketSchema), ticketController.createTicket);
// LIST tickets: MANAGER (all), SUPPORT (assigned), USER (own)
router.get('/', authenticateJWT, authorizeRoles('MANAGER', 'SUPPORT', 'USER'), ticketController.listTickets);
// MANAGER and SUPPORT can assign tickets
router.patch('/:id/assign', authenticateJWT, authorizeRoles('MANAGER', 'SUPPORT'), validate(assignTicketSchema), ticketController.assignTicket);
router.patch('/:id/status', authenticateJWT, authorizeRoles('MANAGER', 'SUPPORT'), validate(changeStatusSchema), ticketController.changeStatus);
// Only MANAGER can delete tickets
router.delete('/:id', authenticateJWT, authorizeRoles('MANAGER'), ticketController.deleteTicket);

// Comments
router.post('/:id/comments', authenticateJWT, validate(createCommentSchema), commentController.createComment);
const commentListController = require('../controllers/comment.list.controller');
router.get('/:id/comments', authenticateJWT, commentListController.listComments);

module.exports = router;
