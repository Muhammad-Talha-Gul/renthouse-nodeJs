const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/index', indexController);
module.exports = router;