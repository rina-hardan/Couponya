import { body } from "express-validator";

const baseValidators = [
  body("userName").notEmpty().withMessage("Username is required"),
  body("name").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .isIn(["customer", "business_owner"])
    .withMessage("Role must be customer or business_owner")
];

const customerValidators = [
  body("birth_date")
    .notEmpty()
    .withMessage("Birth date is required")
    .isISO8601()
    .withMessage("Birth date must be a valid date"),
  body("region_id")
    .notEmpty()
    .withMessage("Region ID is required")
    .isInt({ gt: 0 })
    .withMessage("Region ID must be a positive integer")
];

const businessOwnerValidators = [
  body("business_name")
    .notEmpty()
    .withMessage("Business name is required"),
  body("description")
    .notEmpty()
    .withMessage("Business description is required"),
  body("website_url")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Website URL must be valid")
];

const validateRegistrationFields = (req, res, next) => {
  const role = req.body.role;

  let validations = [...baseValidators];

  if (role === "customer") {
    validations.push(...customerValidators);
  } else if (role === "business_owner") {
    validations.push(...businessOwnerValidators);
  }

  return Promise.all(validations.map(validation => validation.run(req)))
    .then(() => next())
    .catch(next);
};

export default validateRegistrationFields;
