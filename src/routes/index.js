const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers');

router.get('/', controller.index_get);

router.post('/', controller.index_post);

router.get('/about', controller.about_get);

module.exports = router;
