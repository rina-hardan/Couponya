import express from "express";
import usersController from "../controllers/usersController.js";
import {verifyToken} from "../middleware/auth.js"
import conditionalUpload from "../middleware/conditionalUpload.js";
const usersRouter = express.Router();

usersRouter.post("/register",conditionalUpload, usersController.register);
usersRouter.post("/login", usersController.login);
 usersRouter.put("/update", verifyToken,conditionalUpload, usersController.update);
export default usersRouter;