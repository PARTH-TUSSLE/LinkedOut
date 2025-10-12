import { NextFunction, Request, Response } from "express";
import jwt, {  JwtPayload } from "jsonwebtoken";
import "dotenv/config";


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = ( req: Request, res: Response, next: NextFunction ) => {

  const token = req.headers["authorization"];

  try {
    if ( !token ) {
    res.json({
      msg: "Unauthorized!"
    })
    return
  }

  if ( !process.env.JWT_SECRET ) {
    res.json({
      msg: "JWT_SECRET not configured!"
    })
    return
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded) {
    req.userId = (decoded as JwtPayload).id;
  }

  next();


  } catch (error) {
    res.json({
      msg: "Unauthorized!",
    });
  }


}