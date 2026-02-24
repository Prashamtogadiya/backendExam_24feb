const ticketService = require('../services/ticket.service');

const createTicket = async (req, res) => {
  try {
    const payload = req.body; // validated
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const created = await ticketService.createTicket({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || 'MEDIUM',
      createdById: userId,
    });

    if (!created) return res.status(400).json({ message: 'Bad request' });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket };

const assignTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    if (!ticketId) return res.status(400).json({ message: 'Invalid ticket id' });

    const { userId } = req.body; // validated by middleware
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const result = await ticketService.assignTicket({ ticketId, userId });
    if (result.status && result.status !== 200) return res.status(result.status).json({ message: result.message });

    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket, assignTicket };

const listTickets = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const list = await ticketService.listTickets(user);
    return res.status(200).json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket, assignTicket, listTickets };

const changeStatus = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    if (!ticketId) return res.status(400).json({ message: 'Invalid ticket id' });

    const { status } = req.body; // validated
    if (!status) return res.status(400).json({ message: 'status is required' });

    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const result = await ticketService.changeStatus({ ticketId, status, changedBy: userId });
    if (result.status && result.status !== 200) return res.status(result.status).json({ message: result.message });

    return res.status(200).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket, assignTicket, listTickets, changeStatus };

const deleteTicket = async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    if (!ticketId) return res.status(400).json({ message: 'Invalid ticket id' });

    const result = await ticketService.deleteTicket({ ticketId });
    if (result.status && result.status !== 204) return res.status(result.status).json({ message: result.message });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createTicket, assignTicket, listTickets, changeStatus, deleteTicket };
