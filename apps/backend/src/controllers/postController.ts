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
      error,
    });
  }
};

export const addCommentController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const postId = Number(req.body.postId);
  const commentBody = req.body.commentBody;

  if (!id || isNaN(id)) {
    return res.json({
      msg: "Invalid userID",
    });
  }

  if (!postId || isNaN(postId)) {
    return res.json({
      msg: "Missing or Invalid postID",
    });
  }

  if (!commentBody) {
    return res.json({
      msg: "Comment body cannot be empty!",
    });
  }

  try {
    const post = await client.post.findFirst({
      where: {
        postId: postId,
      },
    });

    if (!post) {
      return res.json({
        msg: "Post not found!",
      });
    }

    const addedComment = await client.comment.create({
      data: {
        creatorId: id,
        postId: postId,
        body: commentBody,
      },
    });

    return res.json({
      addedComment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occurred!",
      error,
    });
  }
};

export const getAllCommentsOnPostController = async (
  req: Request,
  res: Response
) => {
  const postId = Number(req.params.postId);

  if (!postId || isNaN(postId)) {
    return res.json({
      msg: "Invalid postID",
    });
  }

  try {
    const comments = await client.comment.findMany({
      where: {
        postId: postId,
      },
    });

    if (comments.length === 0) {
      return res.json({
        msg: "No comments found!",
      });
    }

    return res.json({
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occured!",
      error,
    });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const commentId = Number(req.body.commentId);

  if (!id || isNaN(id)) {
    return res.json({
      msg: "Invalid userId!",
    });
  }

  if (!commentId || isNaN(commentId)) {
    return res.json({
      msg: "Invalid commentId!",
    });
  }

  try {
    const comment = await client.comment.findFirst({
      where: {
        commentId: commentId,
      },
    });

    if (!comment) {
      return res.json({
        msg: "Comment not found!",
      });
    }

    if (id === comment.creatorId) {
      const deletedComment = await client.comment.delete({
        where: {
          commentId: commentId,
        },
      });

      return res.json({
        deletedComment,
      });
    } else {
      return res.json({
        msg: "User not authorized to delete this comment",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occurred!",
    });
  }
};

export const increasePostLikeController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.userId);
  const postId = Number(req.body.postId);

  if (!id || isNaN(id)) {
    return res.json({
      msg: "Invalid userId",
    });
  }

  if (!postId || isNaN(postId)) {
    return res.json({
      msg: "Invalid postId",
    });
  }

  try {
    const post = await client.post.findFirst({
      where: {
        postId: postId,
      },
    });

    if (!post) {
      return res.json({
        msg: "Post not found!",
      });
    }

    await client.post.update({
      where: {
        postId: postId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });

    return res.json({
      msg: "Increased like count by 1",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occured!",
    });
  }
};
