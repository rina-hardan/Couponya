import { body } from "express-validator";

export const createOrderValidator = [
  body("items")
    .isArray({ min: 1 }).withMessage("Items must be a non-empty array"),

  body("items.*.couponId")
    .notEmpty().withMessage("couponId is required")
    .isInt({ gt: 0 }).withMessage("couponId must be a positive integer"),

  body("items.*.quantity")
    .notEmpty().withMessage("quantity is required")
    .isInt({ gt: 0 }).withMessage("quantity must be a positive integer"),

  body("items.*.pricePerUnit")
    .notEmpty().withMessage("pricePerUnit is required")
    .isFloat({ gte: 0 }).withMessage("pricePerUnit must be a positive number"),

  body("usePoints")
    .optional()
    .isBoolean().withMessage("usePoints must be a boolean"),
];
