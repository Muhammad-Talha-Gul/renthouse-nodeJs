const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validation.js");
const {
  userStoreValidation,
} = require("../validators/user.validation.js");
const {
  careateCategoryValidation,
} = require("../validators/category.validation.js");
const {
  propertyStoreValidation,
} = require("../validators/propertyStore.validation.js");
const validate = require("../../middleware/validate.js");
const indexController = require("../controllers/indexController");
const adminCategoriesController = require("../controllers/adminCategoriesController");
const adminPropertiesController = require("../controllers/adminPropertiesController");
const authController = require("../controllers/authController");
const adminUserController = require("../controllers/adminUserController");
const usersController = require("../controllers/usersController");
router.get("/index", indexController.index);
router.get("/properties/details/:id", indexController.details);

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
router.post(
  "/user/store",
  userStoreValidation,
  validate,
  // authMiddleware("users"),
  adminUserController.register,
);
router.put("/user/update/:id",
  authMiddleware("users"),
  adminUserController.update,
);
router.put("/user/fields_permissions/update/:id",
  authMiddleware("users"),
  adminUserController.fieldsPermissionUpdate,
);
router.put("/user/modules_permissions/update/:id",
  authMiddleware("users"),
  adminUserController.modulesPermissionUpdate,
);

// users
router.get("/users/index", authMiddleware("users"), usersController.index);
router.get(
  "/users/modules_fields",
  authMiddleware("users"),
  usersController.getModulesAndFields,
);

// Public Properties Search
router.get("/properties/search", adminPropertiesController.search);
router.get("/properties/details/:id", adminPropertiesController.details);

module.exports = router;


// Admin Properties 
router.get("/properties/index", authMiddleware("properties"), adminPropertiesController.index);

router.post(
  "/property/store",
  upload.any(),
  propertyStoreValidation,
  validate,
  authMiddleware("properties"),
  adminPropertiesController.store
);

router.put(
  "/properties/update/:id",
  upload.any(),
  authMiddleware("properties"),
  adminPropertiesController.update
);

router.delete(
  "/properties/destroy/:id",
  authMiddleware("properties"),
  adminPropertiesController.destroy
);