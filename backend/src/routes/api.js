const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validation.js");
const {
  careateCategoryValidation,
} = require("../validators/category.validation.js");
const validate = require("../../middleware/validate.js");
const indexController = require("../controllers/indexController");
const adminCategoriesController = require("../controllers/adminCategoriesController");
const adminPropertiesController = require("../controllers/adminPropertiesController");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
router.get("/index", indexController);

// categories routes
router.get(
  "/categories/index",
  authMiddleware("categories"),
  adminCategoriesController.index,
);
router.post(
  "/categories/store",
  authMiddleware("categories"),
  careateCategoryValidation,
  validate,
  adminCategoriesController.store,
);
router.put(
  "/categories/update/:recordId",
  authMiddleware("categories"),
  adminCategoriesController.update,
);
router.delete(
  "/categories/distroy/:recordId",
  authMiddleware("categories"),
  adminCategoriesController.distroy,
);

router.post("/auth/login", loginValidation, validate, authController.login);
router.post(
  "/auth/register",
  registerValidation,
  validate,
  // authMiddleware("users"),
  authController.register,
);
router.put(
  "/auth/user_update/:id",
  authMiddleware("users"),
  authController.update,
);

// users
router.get("/users/index", authMiddleware("users"), usersController.index);
router.get(
  "/users/modules_fields",
  authMiddleware("users"),
  usersController.getModulesAndFields,
);
module.exports = router;


// Admin Properties 
router.get("/properties/index", authMiddleware("categories"), adminPropertiesController.index);