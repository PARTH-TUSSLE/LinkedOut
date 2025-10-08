import { Request, Response } from "express";
import { Jwt } from "jsonwebtoken";
import {client} from "@repo/db/client";
import { SignUpSchema } from "@repo/common/types"

export const signupController = async (req: Request, res: Response) => {

  const parsedData = SignUpSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    res.json({
      msg: "Incorrect inputs !"
    })
    return
  }

  try {

    const user = await client.user.create({
      data: {
        name: parsedData.data.name,
        username: parsedData.data.username,
        email: parsedData.data.email
      }
    })

    res.status(200).json({
      msg: "User created successfully !"
    })


  } catch (error) {

    res.json({
      msg: "username or email already taken" 
    })

  }

};


