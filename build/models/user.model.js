"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const global_types_1 = require("../types/global.types");
const userSchema = new mongoose_1.default.Schema({
    full_name: {
        type: String,
        required: [true, 'Full_name is required'],
        trim: true
    },
    email: {
        required: [true, 'Email is requored'],
        type: String,
        unique: [true, 'User already exists with provided email'],
    },
    password: {
        required: [true, 'Password is required'],
        min: [6, 'Password must be at least 6 characters long'],
        type: String
    },
    phone_number: {
        type: String
    },
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'product'
        },
    ],
    role: {
        type: String,
        enum: Object.values(global_types_1.Role),
        default: global_types_1.Role.USER
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
