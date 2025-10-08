import { Request, Response } from "express";
import { Jwt } from "jsonwebtoken";

export const signupController = async (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({
    msg: "working!",
    name,
  });
};
