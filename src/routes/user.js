const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');

router.get('/:id/create', UserController.create_get);

router.post('/:id/create', UserController.create_post);

router.get('/:id/upgrade/member', UserController.upgrade_member_get);

router.post('/:id/upgrade/member', UserController.upgrade_member_post);

router.get('/:id/upgrade/admin', UserController.upgrade_admin_get);

router.post('/:id/upgrade/admin', UserController.upgrade_admin_post);

router.get('/:id/downgrade/member', UserController.downgrade_member);

router.get('/:id/downgrade/admin', UserController.downgrade_admin);

module.exports = router;
