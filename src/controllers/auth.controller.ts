import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { compare, hash } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken } from "../utils/jwt.utils";
import { sendEmail } from "../utils/nodemailer.utils";

// register
export const register = asyncHandler(async (req: Request, res: Response) => {
  // req.body
  const { email, full_name, password, phone_number } = req.body;

  if (!password) {
    throw new CustomError("Password is required", 404);
  }
  // hashing user password
  const hashedPassword = await hash(password);

  // creating new user
  const user = await User.create({
    email,
    full_name,
    password: hashedPassword,
    phone_number,
  });

  // throw error
  if (!user) {
    throw new CustomError("Registration failed.Try again.", 500);
  }

  // send account created email
  const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9;">
    <h1 style="color: #4CAF50; text-align: center;">Account Created Successfully</h1>
    <h2 style="color: #333;">Account Details</h2>
    <p style="margin: 8px 0;"><strong>Full Name:</strong> ${user.full_name ?? 'Not provided'}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> ${user.email}</p>
    <p style="margin: 8px 0;"><strong>Phone Number:</strong> ${user.phone_number ?? 'Not provided'}</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${req.protocol}://${req.hostname}/login" style="display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
        Login to Your Account
      </a>
    </div>
  </div>
`;

await sendEmail({
  to: user.email,
  subject: "Account Created Successfully",
  html,})

  // success response
  res.status(201).json({
    message: "User registered successfully",
    success: true,
    status: "success",
    data: {
      user,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new CustomError("Email is required", 400);
  }

  if (!password) {
    throw new CustomError("password is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("email or password does not match", 400);
  }



  const isPasswordMatch = await compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("email or password does not match", 400);
  }

  // jwt token
  const payload = {
    full_Name: user.full_name,
    _id: user._id,
    role: user.role,
    email: user.email,
  };

  const token = generateToken(payload);

  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_EXPIRES_IN || 1) * 24 * 60 * 60 * 1000,
      secure: false,
    })
    .json({
      message: "Login success",
      success: true,
      status: "success",
      data: {
        user,
        access_token: token,
      },
    });
});

function next(error: any) {
  throw new Error("Function not implemented.");
}
