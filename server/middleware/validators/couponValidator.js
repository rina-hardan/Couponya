import { body, param } from "express-validator";

export const createCouponValidator = [
  body("business_owner_id")
    .notEmpty().withMessage("business_owner_id is required")
    .isInt({ gt: 0 }).withMessage("business_owner_id must be a positive integer"),

  body("category_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage("category_id must be a positive integer"),

  body("region_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage("region_id must be a positive integer"),

  body("title")
    .notEmpty().withMessage("title is required")
    .isLength({ min: 3 }).withMessage("title must be at least 3 characters"),

  body("description")
    .optional({ nullable: true })
    .isString().withMessage("description must be a string"),

  body("original_price")
    .notEmpty().withMessage("original_price is required")
    .isFloat({ gt: 0 }).withMessage("original_price must be a positive number"),

  body("discounted_price")
    .notEmpty().withMessage("discounted_price is required")
    .isFloat({ gt: 0 }).withMessage("discounted_price must be a positive number"),

  body("address")
    .optional({ nullable: true })
    .isString().withMessage("address must be a string"),

  body("code")
    .optional({ nullable: true })
    .isString().withMessage("code must be a string"),

  body("quantity")
    .notEmpty().withMessage("quantity is required")
    .isInt({ gt: 0 }).withMessage("quantity must be a positive integer"),

  body("expiry_date")
    .notEmpty().withMessage("expiry_date is required")
    .isISO8601().withMessage("expiry_date must be a valid date"),

  body("is_active")
    .optional()
    .isBoolean().withMessage("is_active must be boolean"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "rejected"]).withMessage("status must be one of pending, confirmed, rejected"),
];

export const updateCouponValidator = [
  param("id")
    .isInt({ gt: 0 }).withMessage("Coupon ID must be a positive integer"),

  body("business_owner_id")
    .optional()
    .isInt({ gt: 0 }).withMessage("business_owner_id must be a positive integer"),

  body("category_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage("category_id must be a positive integer"),

  body("region_id")
    .optional({ nullable: true })
    .isInt({ gt: 0 }).withMessage("region_id must be a positive integer"),

  body("title")
    .optional()
    .isLength({ min: 3 }).withMessage("title must be at least 3 characters"),

  body("description")
    .optional({ nullable: true })
    .isString().withMessage("description must be a string"),

  body("original_price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("original_price must be a positive number"),

  body("discounted_price")
    .optional()
    .isFloat({ gt: 0 }).withMessage("discounted_price must be a positive number"),

  body("address")
    .optional({ nullable: true })
    .isString().withMessage("address must be a string"),

  body("code")
    .optional({ nullable: true })
    .isString().withMessage("code must be a string"),

  body("quantity")
    .optional()
    .isInt({ gt: 0 }).withMessage("quantity must be a positive integer"),

  body("expiry_date")
    .optional()
    .isISO8601().withMessage("expiry_date must be a valid date"),

  body("is_active")
    .optional()
    .isBoolean().withMessage("is_active must be boolean"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "rejected"]).withMessage("status must be one of pending, confirmed, rejected"),
];

export const couponIdValidator = [
  param("id")
    .isInt({ gt: 0 }).withMessage("Coupon ID must be a positive integer")
];
