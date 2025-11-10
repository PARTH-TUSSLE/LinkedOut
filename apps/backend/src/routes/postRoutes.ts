import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { addCommentController, createPostController, deleteCommentController, deletePostController, getAllCommentsOnPostController, getAllPostsController, increasePostLikeController } from "../controllers/postController.js";

export const postRouter: Router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({storage: storage});

postRouter.post("/create/post",upload.single("media"), authMiddleware, createPostController);
postRouter.get("/posts", getAllPostsController);
postRouter.delete("/delete/post", authMiddleware, deletePostController);
postRouter.post("/create/comment", authMiddleware, addCommentController);
postRouter.get("/posts/:postId/comments", getAllCommentsOnPostController);
postRouter.delete("/delete/comment", authMiddleware, deleteCommentController);
postRouter.post("/increaseLikes", authMiddleware, increasePostLikeController)