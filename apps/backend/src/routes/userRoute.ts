import { Router } from "express";
import {
  getUserAndProfileController,
  signInController,
  signupController,
  updateUserController,
  uploadProfilePicture,
} from "../controllers/userController.js";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter: Router = Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });


userRouter.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  authMiddleware,
  uploadProfilePicture
);

userRouter.post("/signup", signupController);
userRouter.post("/signin", signInController);
userRouter.post("/update_user", authMiddleware, updateUserController)
userRouter.get("/get_user_and_profile", authMiddleware, getUserAndProfileController )

export default userRouter;
