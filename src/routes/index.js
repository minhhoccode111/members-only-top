const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

/* GET home page. */
router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Members Only' });
  })
);

router.get(
  '/about',
  asyncHandler(async (req, res, next) => {
    res.send(`ABOUT GET: NOT IMPLEMENTED YET`);
    // res.render('about', { title: 'About' });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    res.send(`:ID: ${req.params.id} GET: NOT IMPLEMENTED YET`);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Express' });
  })
);

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    res.render('index', { title: 'Express' });
  })
);

module.exports = router;
