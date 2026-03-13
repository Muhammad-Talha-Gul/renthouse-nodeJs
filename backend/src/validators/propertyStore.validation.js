const { body } = require("express-validator");

const propertyStoreValidation = [
  body("category_id")
    .notEmpty()
    .withMessage("Category is required")
    .isInt({ min: 1 })
    .withMessage("Category must be a valid ID"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Title must be between 3 and 255 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description too long"),

  body("listing_type")
    .notEmpty()
    .withMessage("Listing type is required")
    .isIn(["rent", "sale"])
    .withMessage("Listing type must be rent or sale"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid number"),

  body("bedrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a positive number"),

  body("bathrooms")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bathrooms must be a positive number"),

  body("area")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Area must be a valid number"),

  body("area_unit")
    .optional()
    .isIn(["sqft", "sqm", "kanal", "marla"])
    .withMessage("Invalid area unit"),

  body("city")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City name too long"),

  body("state")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("State name too long"),

  body("country")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country name too long"),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude"),

  body("status")
    .optional()
    .isIn(["available", "sold", "rented"])
    .withMessage("Invalid property status"),

  // body("slug")
  //   .notEmpty()
  //   .withMessage("Slug is required")
  //   .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  //   .withMessage("Slug must be lowercase and hyphen-separated"),
];

module.exports = { propertyStoreValidation };
