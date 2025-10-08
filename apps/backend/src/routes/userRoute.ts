import { Router } from "express";
import { signupController } from "../controllers/userController.js";

const userRouter: Router = Router();

userRouter.post("/signup", signupController);

export default userRouter;
