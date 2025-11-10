import { client } from "@repo/db/client";
import { Request, Response } from "express";

export const createPostController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const { body } = req.body;

  if (!id || isNaN(id)) {
    return res.json({
      msg: "Not authorized !",
    });
  }

  if (!body || body.trim() === "") {
    return res.json({
      msg: "Post body is required!",
    });
  }

  try {
    const post = await client.post.create({
      data: {
        creatorId: id,
        body: body,
        media: req.file != undefined ? req.file.filename : "",
        fileType: req.file != undefined ? req.file?.mimetype.split("/")[1] : "",
      },
    });

    return res.json({
      msg: "Post created successfully !",
      post,
    });
  } catch (error) {
    return res.json({
      msg: "Some error occurred !",
    });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {

  try {
    const posts = await client.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      posts,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Some error occured!",
    });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const postId = Number(req.body.postId);

  if (!postId || isNaN(postId)) {
    return res.json({
      msg: "Missing or Invalid postID",
    });
  }

  if (!id || isNaN(id)) {
    return res.json({
      msg: "Invalid userID",
    });
  }

  try {
    const postToBeDeleted = await client.post.findFirst({
      where: {
        postId: postId,
      },
    });

    if (!postToBeDeleted) {
      return res.json({
        msg: "Post not found!",
      });
    }

    if (postToBeDeleted.creatorId === id) {
      const deletedPost = await client.post.delete({
        where: {
          postId: postId,
        },
      });
      return res.json({
        msg: "Post deleted successfully",
        deletedPost,
      });
    } else {
      return res.json({
        msg: "User not authorized to delete",
      });
    }
  } catch (error) {
    return res.json({
      msg: "Some error occurred!",
      error
    });
  }
};

