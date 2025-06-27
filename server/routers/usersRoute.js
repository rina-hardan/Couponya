import express from "express";
import usersController from "../controllers/usersController.js";
import { verifyToken } from "../middleware/auth.js";
import conditionalUpload from "../middleware/conditionalUpload.js";
import validate from "../middleware/validate.js";
import { loginValidator } from "../middleware/validators/loginValidator.js";
import validateRegistrationFields from "../middleware/validators/userRegistrationValidator.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  conditionalUpload,
  validateRegistrationFields, 
  validate, 
  usersController.register
);

usersRouter.post("/login",loginValidator,validate, usersController.login);

usersRouter.put("/update", verifyToken, conditionalUpload, usersController.update);

export default usersRouter;
