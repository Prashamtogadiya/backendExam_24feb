const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createUserSchema } = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

router.post('/', authenticateJWT, authorizeRoles('MANAGER'), validate(createUserSchema), userController.createUser);
router.get('/', authenticateJWT, authorizeRoles('MANAGER'), userController.listUsers);

module.exports = router;
