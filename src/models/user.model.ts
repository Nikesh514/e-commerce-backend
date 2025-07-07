import mongoose from "mongoose";
import { Role } from "../types/global.types";

const userSchema = new mongoose.Schema({
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
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
    ],
    role: {
        type:String,
        enum:Object.values(Role),
        default:Role.USER
    }
})



const User = mongoose.model('User', userSchema);
export default User