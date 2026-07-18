import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addCommentController, createPostController, decreasePostLikeController, deleteCommentController, deletePostController, getAllCommentsOnPostController, getAllPostsController, increasePostLikeController } from "../controllers/postController.js";

export const postRouter: Router = Router();

const allowedMimes = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/mpeg", "video/quicktime",
  "audio/mpeg", "audio/wav", "audio/ogg",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: jpeg, png, gif, webp, mp4, mpeg, mov, mp3, wav, ogg"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "File too large. Max 20MB allowed." });
    }
    return res.status(400).json({ msg: err.message });
  }
  if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

postRouter.post("/create/post", upload.single("media"), handleMulterError, authMiddleware, createPostController);
postRouter.get("/posts", getAllPostsController);
postRouter.delete("/delete/post", authMiddleware, deletePostController);
postRouter.post("/create/comment", authMiddleware, addCommentController);
postRouter.get("/posts/:postId/comments", getAllCommentsOnPostController);
postRouter.delete("/delete/comment", authMiddleware, deleteCommentController);
postRouter.post("/increaseLikes", authMiddleware, increasePostLikeController);
postRouter.post("/decreaseLikes", authMiddleware, decreasePostLikeController);