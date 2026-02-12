import { body } from "express-validator";

export const careateCategoryValidation = [
  body("name", "Category name is required")
    .notEmpty()
    .withMessage("Category name is required"),
  body("icon", "Category icon is required")
    .notEmpty()
    .withMessage("Category icon is required"),
  body("slug", "Category slug is required")
    .notEmpty()
    .withMessage("Category slug is required"),
];
