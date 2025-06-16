import express from "express";
import usersController from "../controllers/usersController.js";
import {verifyToken} from "../middleware/auth.js"
const usersRouter = express.Router();

usersRouter.post("/register", usersController.register);
usersRouter.post("/login", usersController.login);
 usersRouter.put("/update", verifyToken, usersController.update);
export default usersRouter;