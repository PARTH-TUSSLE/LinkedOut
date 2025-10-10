import { Router } from "express";
import { signInController, signupController } from "../controllers/userController.js";
import multer from  "multer";

const userRouter: Router = Router();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signInController)


export default userRouter;

