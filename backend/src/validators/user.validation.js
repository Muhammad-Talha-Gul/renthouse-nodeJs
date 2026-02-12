const { body } = require("express-validator");
exports.userStoreValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role_id").isInt().withMessage("Role ID must be an integer"),
  body("active_status").isInt().withMessage("Active status must be an integer"),
];

exports.userUpdateValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role_id").optional().isInt().withMessage("Role ID must be an integer"),
  body("active_status")
    .optional()
    .isInt()
    .withMessage("Active status must be an integer"),
];
