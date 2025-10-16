import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { SignUpSchema, SignInSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import "dotenv/config";

export const signupController = async (req: Request, res: Response) => {
  const parsedData = await SignUpSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      msg: "Incorrect inputs !",
    });
    return;
  }

  try {
    const hashedPass = await bcrypt.hash(parsedData.data.password, 10);

    const user = await client.user.create({
      data: {
        name: parsedData.data.name,
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: hashedPass,
      },
    });

    const profile = await client.profile.create({
      data: {
        userId: user.id,
      },
    });

    res.status(201).json({
      msg: "User created successfully !",
      user,
      profile,
    });
  } catch (error) {
    res.status(409).json({
      msg: "username or email already taken",
    });
  }
};

export const signInController = async (req: Request, res: Response) => {
  const parsedData = await SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(400).json({
      msg: "Incorrect inputs",
    });
    return;
  }

  try {
    const { username, email, password } = parsedData.data;

    const user = await client.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (!user) {
      res.status(401).json({
        msg: "Wrong credentials!",
      });

      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      res.status(401).json({
        msg: "Wrong credentials!",
      });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
      res.status(200).json({
        msg: "User signed in successfully!",
        token,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Unauthorized!",
    });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!req.file || !req.file.filename) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const updated = await client.user.update({
      where: { id: Number(userId) },
      data: { profilePicture: req.file.filename },
    });

    return res
      .status(200)
      .json({ msg: "Profile picture updated", user: updated });
  } catch (err: any) {
    console.error("uploadProfilePicture error:", err);
    return res.status(500).json({ msg: "Some error occurred while updating" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.json({
        msg: "You're not unauthorized!",
      });
      return;
    }

    const { username = "", email = "" }: { username?: string; email?: string } =
      req.body;

    const user = await client.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.json({
        msg: "User not found!",
      });
      return;
    }

    const existingUser = await client.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (!existingUser) {
      const updatedUser = await client.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          username: username,
          email: email,
        },
      });
      res.json({ msg: "User updated successfully!", updatedUser });
      return;
    }

    if (existingUser.id === user.id) {
      const updatedUser = await client.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          username: username,
          email: email,
        },
      });
      res.json({ msg: "User updated successfully!", updatedUser });
      return;
    }

    res.status(409).json({ msg: "Username or email already taken!" });
    return;
  } catch (error) {
    res.status(500).json({
      msg: "Some unexpected error ocuured!",
    });
  }
};

export const getUserAndProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;

    const user = await client.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      res.json({
        msg: "user not found!",
      });
      return;
    }

    const profile = await client.profile.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    res.json({
      user,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Some unexpected error occured !",
    });
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { bio, occupationStatus, location, education, workHistory } =
      req.body;

    if (!userId) {
      res.json({
        msg: "User not found!",
      });
      return;
    }

    const profileToUpdate = await client.profile.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    if (!profileToUpdate) {
      res.json({
        msg: "No profile found!",
      });
      return;
    }

    const updatedProfile = await client.profile.update({
      where: { userId: Number(userId) },
      data: {
        bio: bio,
        occupationStatus: occupationStatus,
        location: location,

        education: {
          deleteMany: {},
          create: education,
        },

        workHistory: {
          deleteMany: {},
          create: workHistory,
        },
      },
    });

    res.json({
      msg: "Profile updated successfully!",
      updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Some unexpected error occurred!",
      error,
    });
  }
};


// Function to get all profiles with user data (equivalent to your MongoDB populate example)
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const profiles = await client.profile.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            email: true,
            profilePicture: true,
          },
        },
        education: true,
        workHistory: true,
      },
    });

    return res.json({ profiles });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};
