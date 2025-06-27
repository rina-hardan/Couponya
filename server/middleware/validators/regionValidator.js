import { body } from "express-validator";

export const addRegionValidator = [
  body("name")
    .notEmpty().withMessage("Region name is required")
    .isLength({ min: 2 }).withMessage("Region name must be at least 2 characters"),
];
