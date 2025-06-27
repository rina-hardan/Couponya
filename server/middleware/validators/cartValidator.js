// middleware/cartValidator.js
import { body } from "express-validator";

export const addToCartValidator = [
  body("couponId").notEmpty().withMessage("couponId is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("pricePerUnit").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("title").optional().isString().withMessage("Title must be a string")
];

export const removeFromCartValidator = [
  body("couponId").notEmpty().withMessage("couponId is required")
];

export const updateQuantityValidator = [
  body("couponId").notEmpty().withMessage("couponId is required"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

