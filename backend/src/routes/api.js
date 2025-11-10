const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const adminCategoriesController = require('../controllers/adminCategoriesController');

router.get('/index', indexController);
router.get('/categories/index', adminCategoriesController.index);
router.post('/categories/store', adminCategoriesController.store);
module.exports = router;