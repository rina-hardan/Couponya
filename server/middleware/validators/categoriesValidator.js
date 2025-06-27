import { body } from "express-validator";

export const categoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 100 })
    .withMessage("Category name must be at most 100 characters"),
];
