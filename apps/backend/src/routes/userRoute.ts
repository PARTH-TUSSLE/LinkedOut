import { Router } from "express";
import {
  connectionReqStatusController,
  downloadProfileController,
  getAllUsersController,
  getUserAndProfileController,
  myReceivedReqsController,
  mySentReqsController,
  sendConnectionReqController,
  signInController,
  signupController,
  updateUserController,
  updateUserProfileController,
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
userRouter.post("/update_user_profile", authMiddleware, updateUserProfileController);
userRouter.get("/getAllUsers", getAllUsersController);
userRouter.get("/user/downloadResume/", downloadProfileController)
userRouter.post("/user/send_request_connection", authMiddleware, sendConnectionReqController);
userRouter.get("/user/my_sent_reqs", authMiddleware, mySentReqsController);
userRouter.get("/user/my_received_reqs", authMiddleware, myReceivedReqsController);
userRouter.post(
  "/user/connection_Req_Status",
  connectionReqStatusController);


export default userRouter;
