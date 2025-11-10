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
