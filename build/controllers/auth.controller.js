"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
// register
exports.register = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // req.body
    const { email, full_name, password, phone_number } = req.body;
    if (!password) {
        throw new error_handler_middleware_1.default("Password is required", 404);
    }
    // hashing user password
    const hashedPassword = yield (0, bcrypt_utils_1.hash)(password);
    // creating new user
    const user = yield user_model_1.default.create({
        email,
        full_name,
        password: hashedPassword,
        phone_number,
    });
    // throw error
    if (!user) {
        throw new error_handler_middleware_1.default("Registration failed.Try again.", 500);
    }
    // send account created email
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background: #f9f9f9;">
    <h1 style="color: #4CAF50; text-align: center;">Account Created Successfully</h1>
    <h2 style="color: #333;">Account Details</h2>
    <p style="margin: 8px 0;"><strong>Full Name:</strong> ${(_a = user.full_name) !== null && _a !== void 0 ? _a : 'Not provided'}</p>
    <p style="margin: 8px 0;"><strong>Email:</strong> ${user.email}</p>
    <p style="margin: 8px 0;"><strong>Phone Number:</strong> ${(_b = user.phone_number) !== null && _b !== void 0 ? _b : 'Not provided'}</p>
    <div style="text-align: center; margin-top: 30px;">
      <a href="${req.protocol}://${req.hostname}/login" style="display: inline-block; background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold;">
        Login to Your Account
      </a>
    </div>
  </div>
`;
    yield (0, nodemailer_utils_1.sendEmail)({
        to: user.email,
        subject: "Account Created Successfully",
        html,
    });
    // success response
    res.status(201).json({
        message: "User registered successfully",
        success: true,
        status: "success",
        data: {
            user,
        },
    });
}));
exports.login = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default("Email is required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default("password is required", 400);
    }
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    const isPasswordMatch = yield (0, bcrypt_utils_1.compare)(password, user.password);
    if (!isPasswordMatch) {
        throw new error_handler_middleware_1.default("email or password does not match", 400);
    }
    // jwt token
    const payload = {
        full_Name: user.full_name,
        _id: user._id,
        role: user.role,
        email: user.email,
    };
    const token = (0, jwt_utils_1.generateToken)(payload);
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
}));
function next(error) {
    throw new Error("Function not implemented.");
}
