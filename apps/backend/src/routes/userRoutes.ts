import { Router } from "express";
import {
  connectionReqStatusController,
  disconnectController,
  downloadProfileController,
  getAllUsersController,
  getUserAndProfileController,
  getProfileByUserIdController,
  myConnectionsController,
  myReceivedReqsController,
  mySentReqsController,
  sendConnectionReqController,
  signInController,
  signupController,
  updateUserController,
  removeProfilePictureController,
  updateUserProfileController,
  uploadProfilePicture,
  verifyTokenController,
} from "../controllers/userController.js";
import multer from "multer";
import { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter: Router = Router();

const imageMimes = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (imageMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images allowed: jpeg, png, gif, webp"));
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "File too large. Max 5MB allowed." });
    }
    return res.status(400).json({ msg: err.message });
  }
  if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

userRouter.post(
  "/update_profile_picture",
  upload.single("profile_picture"),
  handleMulterError,
  authMiddleware,
  uploadProfilePicture
);

userRouter.post(
  "/remove_profile_picture",
  authMiddleware,
  removeProfilePictureController
);

userRouter.post("/signup", signupController);
userRouter.post("/signin", signInController);
userRouter.post("/update_user", authMiddleware, updateUserController);
userRouter.get(
  "/get_user_and_profile",
  authMiddleware,
  getUserAndProfileController
);
userRouter.get(
  "/user/profile/:userId",
  authMiddleware,
  getProfileByUserIdController
);
userRouter.post(
  "/update_user_profile",
  authMiddleware,
  updateUserProfileController
);
userRouter.get("/getAllUsers", authMiddleware, getAllUsersController);
userRouter.get("/user/downloadResume/", downloadProfileController);
userRouter.post(
  "/user/send_request_connection",
  authMiddleware,
  sendConnectionReqController
);
userRouter.get("/user/my_sent_reqs", authMiddleware, mySentReqsController);
userRouter.get(
  "/user/my_received_reqs",
  authMiddleware,
  myReceivedReqsController
);
userRouter.post(
  "/user/connection_Req_Status",
  authMiddleware,
  connectionReqStatusController
);
userRouter.get(
  "/user/connections",
  authMiddleware,
  myConnectionsController
);
userRouter.post(
  "/user/disconnect",
  authMiddleware,
  disconnectController
);
userRouter.get(
  "/verify-token",
  authMiddleware,
  verifyTokenController
);

export default userRouter;
