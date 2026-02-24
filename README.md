Support Ticket API
===================

Brief instructions to get the project running locally and how to create an initial user using the helper script in the `services` folder.

**Prerequisites:**
- Node.js 16+ installed
- A MySQL server with a database created for this project

**Install**

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root containing at minimum the database and JWT secrets. Example values:

```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=support_ticket_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

Make sure these values match your MySQL server.

**Database**

This project uses a simple schema with tables for `roles`, `users`, `tickets`, `ticket_comments`, and `ticket_status_logs`. There are no migrations included here — create the schema outside the app or run any SQL you already have that matches the schema expected by the code.

**Run the app**

Start the development server:

```bash
npm run dev
```

The server will listen on the port configured in `.env` (default 3000).

**Create an initial user**

There is a small helper script you can run to insert a user directly into the database. Edit the values at the bottom of the file and run it with Node.

- Script: [services/createUser.js](services/createUser.js#L1-L999)

Usage:

```bash
# open services/createUser.js and change the example values (name, email, password, roleName)
node services/createUser.js
```

Notes:
- The script will connect to the database and insert a user with the role you specify (for example `MANAGER`, `SUPPORT`, or `USER`).
- If you prefer, you can also create users directly via the API once the server is running by making a POST to the users endpoint (requires a manager account to create users).

**Authentication**

- Login endpoint: see the auth route in `routes` (POST to the login route will return a JWT). Include the token in requests as `Authorization: Bearer <token>`.

**Common status codes**
- 200: OK (successful GET/PUT/PATCH)
- 201: Created (successful POST)
- 204: No Content (successful DELETE)
- 400: Bad Request (validation or malformed input)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource not found)

**Troubleshooting**

- If RBAC appears to allow unauthorized actions, verify that you are using a fresh token and that the user role in the database is correct. The app reads the authoritative `role` from the database for sensitive checks.
- If the app can't connect to the DB, confirm `.env` settings and that MySQL is reachable from this machine.
