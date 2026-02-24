require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/auth.route');
const usersRoute = require('./routes/users.route');
const ticketsRoute = require('./routes/tickets.route');
const commentsRoute = require('./routes/comments.route');

const app = express();

app.use(express.json());

app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/tickets', ticketsRoute);
app.use('/comments', commentsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
