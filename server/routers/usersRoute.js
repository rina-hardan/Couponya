
import express from "express";
import usersController from "../controllers/usersController.js";
// import {verfiyToken} from "../middle"
const usersRouter = express.Router();

usersRouter.post("/register", usersController.register);
usersRouter.post("/login", usersController.login);

export default usersRouter;

