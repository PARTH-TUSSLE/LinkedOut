import { client } from "@repo/db/client";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const createPostController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const { body } = req.body;

  if (!id || isNaN(id)) {
    return res.status(401).json({
      msg: "Not authorized !",
    });
  }

  if (!body || body.trim() === "") {
    return res.status(400).json({
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
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },
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
    const userId = Number(req.userId);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      client.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
      }),
      client.post.count(),
    ]);

    const postIds = posts.map((p) => p.postId);
    const userLikes = await client.like.findMany({
      where: { userId, postId: { in: postIds } },
      select: { postId: true },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    const postsWithLiked = posts.map(({ _count, ...post }) => ({
      ...post,
      commentCount: _count.comments,
      likedByUser: likedPostIds.has(post.postId),
    }));

    return res.json({
      posts: postsWithLiked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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
    return res.status(400).json({
      msg: "Missing or Invalid postID",
    });
  }

  if (!id || isNaN(id)) {
    return res.status(401).json({
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
      return res.status(404).json({
        msg: "Post not found!",
      });
    }

    if (postToBeDeleted.creatorId === id) {
      if (postToBeDeleted.media && postToBeDeleted.media.trim() !== "") {
        const mediaPath = path.join(process.cwd(), "uploads", postToBeDeleted.media);
        fs.unlink(mediaPath, (err) => {
          if (err && err.code !== "ENOENT") {
            console.error("Failed to delete post media:", err);
          }
        });
      }

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
      return res.status(403).json({
        msg: "User not authorized to delete",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occurred!",
    });
  }
};

export const addCommentController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const postId = Number(req.body.postId);
  const commentBody = req.body.commentBody;

  if (!id || isNaN(id)) {
    return res.status(401).json({
      msg: "Invalid userID",
    });
  }

  if (!postId || isNaN(postId)) {
    return res.status(400).json({
      msg: "Missing or Invalid postID",
    });
  }

  if (!commentBody) {
    return res.status(400).json({
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
      return res.status(404).json({
        msg: "Post not found!",
      });
    }

    const addedComment = await client.comment.create({
      data: {
        creatorId: id,
        postId: postId,
        body: commentBody,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    return res.json({
      addedComment,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occurred!",
    });
  }
};

export const getAllCommentsOnPostController = async (
  req: Request,
  res: Response
) => {
  const postId = Number(req.params.postId);

  if (!postId || isNaN(postId)) {
    return res.status(400).json({
      msg: "Invalid postID",
    });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      client.comment.findMany({
        skip,
        take: limit,
        where: {
          postId: postId,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      }),
      client.comment.count({
        where: {
          postId: postId,
        },
      }),
    ]);

    return res.json({
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occured!",
    });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  const id = Number(req.userId);
  const commentId = Number(req.body.commentId);

  if (!id || isNaN(id)) {
    return res.status(401).json({
      msg: "Invalid userId!",
    });
  }

  if (!commentId || isNaN(commentId)) {
    return res.status(400).json({
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
      return res.status(404).json({
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
      return res.status(403).json({
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
    return res.status(401).json({
      msg: "Invalid userId",
    });
  }

  if (!postId || isNaN(postId)) {
    return res.status(400).json({
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
      return res.status(404).json({
        msg: "Post not found!",
      });
    }

    const existingLike = await client.like.findUnique({
      where: {
        userId_postId: { userId: id, postId: postId },
      },
    });

    if (existingLike) {
      return res.status(409).json({
        msg: "Post already liked!",
      });
    }

    await client.$transaction([
      client.like.create({
        data: { userId: id, postId: postId },
      }),
      client.post.update({
        where: { postId: postId },
        data: { likes: { increment: 1 } },
      }),
    ]);

    return res.status(200).json({
      msg: "Increased like count by 1",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occured!",
    });
  }
};

export const decreasePostLikeController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.userId);
  const postId = Number(req.body.postId);

  if (!id || isNaN(id)) {
    return res.status(401).json({
      msg: "Invalid userId",
    });
  }

  if (!postId || isNaN(postId)) {
    return res.status(400).json({
      msg: "Invalid postId",
    });
  }

  try {
    const existingLike = await client.like.findUnique({
      where: {
        userId_postId: { userId: id, postId: postId },
      },
    });

    if (!existingLike) {
      return res.status(404).json({
        msg: "You haven't liked this post!",
      });
    }

    await client.$transaction([
      client.like.delete({
        where: { id: existingLike.id },
      }),
      client.post.update({
        where: { postId: postId },
        data: { likes: { decrement: 1 } },
      }),
    ]);

    return res.json({
      msg: "Decreased like count by 1",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Some error occured!",
    });
  }
};
