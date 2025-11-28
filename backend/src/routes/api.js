const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const adminCategoriesController = require('../controllers/adminCategoriesController');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');
const authMiddleware = require('../../middleware/authMiddleware');

router.get('/index', indexController);
router.get('/categories/index', adminCategoriesController.index);
router.post('/categories/store', authMiddleware, adminCategoriesController.store);
// Accept the id in the URL so frontend can call `/api/categories/update/${id}`
router.put('/categories/update/:recordId', authMiddleware, adminCategoriesController.update);
router.delete('/categories/distroy/:recordId', authMiddleware, adminCategoriesController.distroy);


router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// users 
router.get('/users/index', usersController.index);
router.get('/users//modules_fields', usersController.getModulesAndFields);
module.exports = router;