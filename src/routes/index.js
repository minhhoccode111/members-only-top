const express = require('express');
const router = express.Router();

const IndexController = require('../controllers/indexController');

router.get('/', IndexController.index);

router.get('/about', IndexController.about);

router.get('/logout', IndexController.logout);

router.get('/login', IndexController.login_get);

router.post('/login', IndexController.login_post);

router.get('/signup', IndexController.signup_get);

router.post('/signup', IndexController.signup_post);

router.get('/message/:id/delete', IndexController.message_delete_get);

router.post('/message/:id/delete', IndexController.message_delete_post);

module.exports = router;
