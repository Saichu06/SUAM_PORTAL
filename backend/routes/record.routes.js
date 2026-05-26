const express = require('express');
const router = express.Router();
const recordController = require('../controllers/record.controller');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Protect records route: User must be authenticated and can be Admin or General User
router.use(authenticateToken);
router.use(requireRole(['Admin', 'General User']));

router.get('/', recordController.getRecords);

module.exports = router;
