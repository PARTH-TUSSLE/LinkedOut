import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "@repo/db/client";
import { SignUpSchema, SignInSchema } from "@repo/common/types";
import bcrypt from "bcrypt";
import "dotenv/config";
import PDFDocument from "pdfkit";
import randomString from "randomstring";
import fs from "fs";

const convertUserDataToPDF = async (userData: any): Promise<string> => {
  const doc = new PDFDocument();

  const outputPath = `${randomString.generate(20)}.pdf`;

  const stream = fs.createWriteStream(`uploads/${outputPath}`);

  doc.pipe(stream);

  // Basic information with better spacing
  doc.fontSize(20).text("RESUME", { align: "center" });
  doc.moveDown(1.5);

  // Add profile picture (user's photo or default) - properly centered
  let imagePath = "uploads/default.jpg"; // Default image path

  // Use user's profile picture if it exists, otherwise use default
  if (
    userData.profilePicture &&
    fs.existsSync(`uploads/${userData.profilePicture}`)
  ) {
    imagePath = `uploads/${userData.profilePicture}`;
  }

  // Always display an image (either user's or default)
  if (fs.existsSync(imagePath)) {
    // Calculate center position for image
    const pageWidth = doc.page.width;
    const imageWidth = 120;
    const imageHeight = 120;
    const imageX = (pageWidth - imageWidth) / 2;
    const imageY = doc.y;

    doc.image(imagePath, imageX, imageY, {
      width: imageWidth,
      height: imageHeight,
      fit: [imageWidth, imageHeight],
    });

    // Move Y position past the image
    doc.y = imageY + imageHeight + 20; // 20 points spacing after image
  } else {
    // If even default image doesn't exist, just add spacing
    doc.moveDown(1);
  }

  // Personal information with better spacing
  doc.fontSize(16).text(`Name: ${userData.name || "N/A"}`);
  doc.moveDown(0.5);

  doc.fontSize(14).text(`Email: ${userData.email || "N/A"}`);
  doc.moveDown(0.5);

  doc.fontSize(14).text(`About: ${userData.profile?.bio || "N/A"}`);
  doc.moveDown(0.5);

  doc
    .fontSize(14)
    .text(`Current Position: ${userData.profile?.occupationStatus || "N/A"}`);
  doc.moveDown(0.5);

  doc.fontSize(14).text(`Location: ${userData.profile?.location || "N/A"}`);
  doc.moveDown(1.5);

  // Education section with better spacing
  doc.fontSize(16).text("EDUCATION:");
  doc.moveDown(0.8);

  if (userData.profile?.education && userData.profile.education.length > 0) {
    userData.profile.education.forEach((education: any) => {
      doc.fontSize(12).text(`• School: ${education.school || "N/A"}`);
      doc.moveDown(0.2);
      doc.fontSize(12).text(`  Degree: ${education.degree || "N/A"}`);
      doc.moveDown(0.2);
      doc
        .fontSize(12)
        .text(`  Field of Study: ${education.fieldOfStudy || "N/A"}`);
      doc.moveDown(0.2);
      doc
        .fontSize(12)
        .text(
          `  Years: ${education.startYear || "N/A"} - ${education.endYear || "N/A"}`
        );
      doc.moveDown(0.8);
    });
  } else {
    doc.fontSize(12).text("No education information available");
    doc.moveDown(0.8);
  }
  doc.moveDown(0.5);

  // Work Experience section with better spacing
  doc.fontSize(16).text("WORK EXPERIENCE:");
  doc.moveDown(0.8);

  if (
    userData.profile?.workHistory &&
    userData.profile.workHistory.length > 0
  ) {
    userData.profile.workHistory.forEach((work: any) => {
      doc.fontSize(12).text(`• Company: ${work.company || "N/A"}`);
      doc.moveDown(0.2);
      doc.fontSize(12).text(`  Position: ${work.position || "N/A"}`);
      doc.moveDown(0.2);
      doc.fontSize(12).text(`  Location: ${work.location || "N/A"}`);
      doc.moveDown(0.2);
      doc
        .fontSize(12)
        .text(
          `  Duration: ${work.startDate || "N/A"} - ${work.endDate || "N/A"}`
        );
      doc.moveDown(0.2);
      doc.fontSize(12).text(`  Years: ${work.years || "N/A"}`);
      if (work.description) {
        doc.moveDown(0.2);
        doc.fontSize(12).text(`  Description: ${work.description}`);
      }
      doc.moveDown(0.8);
    });
  } else {
    doc.fontSize(12).text("No work experience available");
    doc.moveDown(0.8);
  }

  // Add some breathing space at the end
  doc.moveDown(1);

  doc.end();

  // Return a promise that resolves when the PDF is fully written
  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      resolve(outputPath);
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

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

export const downloadProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({
        msg: "User ID is required",
      });
    }

    const profile = await client.user.findFirst({
      where: {
        id: Number(userId),
      },
      include: {
        profile: {
          select: {
            bio: true,
            occupationStatus: true,
            location: true,
            education: {
              select: {
                school: true,
                degree: true,
                fieldOfStudy: true,
                startYear: true,
                endYear: true,
              },
            },
            workHistory: {
              select: {
                company: true,
                location: true,
                position: true,
                years: true,
                startDate: true,
                endDate: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Generate PDF
    const outputPath = await convertUserDataToPDF(profile);
    const fullPath = `uploads/${outputPath}`;

    // Set proper headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${profile.name || "user"}_resume.pdf"`
    );

    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(fullPath);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      return res.status(500).json({
        msg: "Error reading generated PDF",
      });
    });

    fileStream.on("end", () => {
      // Clean up the generated file after sending
      fs.unlink(fullPath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    });

    fileStream.pipe(res);
  } catch (error) {
    console.error("Download profile error:", error);
    res.status(500).json({
      msg: "Some unexpected error occurred!",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
