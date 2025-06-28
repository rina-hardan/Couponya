import { body } from "express-validator";

const forbiddenFields = ['email', 'userName', 'role', 'id'];

const forbiddenValidators = forbiddenFields.map((field) =>
  body(field).not().exists().withMessage(`${field} cannot be updated.`)
);

const baseUpdateValidators = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
];

const customerUpdateValidators = [
  body("region_id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Region ID must be a positive integer"),
];

const businessOwnerUpdateValidators = [
  body("business_name")
    .optional()
    .notEmpty()
    .withMessage("Business name is required"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description is required"),
  body("website_url")
    .optional({ nullable: true })
    .isURL()
    .withMessage("Website URL must be valid"),
];

const validateUpdateUserFields = (req, res, next) => {
  const role = req.role;
  let validations = [...forbiddenValidators, ...baseUpdateValidators];

  if (role === "customer") {
    validations.push(...customerUpdateValidators);
  } else if (role === "business_owner") {
    validations.push(...businessOwnerUpdateValidators);
  }

  return Promise.all(validations.map(validation => validation.run(req)))
    .then(() => next())
    .catch(next);
};

export default validateUpdateUserFields;
