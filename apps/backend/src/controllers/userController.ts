import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {client} from "@repo/db/client";
import { SignUpSchema, SignInSchema } from "@repo/common/types"
import bcrypt from 'bcrypt';

 

export const signupController = async (req: Request, res: Response) => {

  const parsedData = await SignUpSchema.safeParse(req.body);
  
  if (!parsedData.success) {
    res.status(400).json({
      msg: "Incorrect inputs !"
    })
    return
  }

  try {
    const hashedPass = await bcrypt.hash(parsedData.data.password, 10); 

    const user = await client.user.create({
      data: {
        name: parsedData.data.name,
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPass
      }
    })

    const profile = await client.profile.create({
      data: {
        userId: user.id
      }
    })

    res.status(201).json({
      msg: "User created successfully !",
      user,
      profile
    })


  } catch (error) {

    res.status(409).json({
      msg: "username or email already taken" 
    })

  }

};


export const signInController = async ( req: Request, res: Response ) => {
  const parsedData = await SignInSchema.safeParse(req.body);

  if ( !parsedData.success ) {
    res.status(400).json({
      msg: "Incorrect inputs"
    })
    return
  }

  try {

    const { username, email, password } = parsedData.data;


    const user = await client.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ],
      }
    })

    if (!user) {
      
      res.status(401).json({
        msg: "Wrong credentials!"
      })

      return

    } 

    const isMatch = await bcrypt.compare(password, user.password);

    if ( isMatch === false ) {
      res.status(401).json({
        msg: "Wrong credentials!",
      });
    } else {

     
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
      res.status(200).json ({
        msg: "User signed in successfully!",
        token
      })
    }
   
    
  } catch (error) {
    res.status(500).json({
      msg: "Unauthorized!"})
  }

}


