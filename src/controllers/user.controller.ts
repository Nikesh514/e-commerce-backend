import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import User from "../models/user.model";
import CustomError from "../middlewares/error-handler.middleware";



export const getAllUser = asyncHandler(async (req:Request, res:Response) => {
    const users = await User.find().select('-password')

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User fetched successfully',
        data: users
    })
})

export const getUserById = asyncHandler(async (req:Request, res:Response) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')

    if (!user) {
        throw new CustomError('User not found', 404)
    }

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User fetched successfully',
        data: user
    })
})

export const removeUser = asyncHandler(async( req:Request, res:Response) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
        throw new CustomError('User not found', 404)
    }

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User deleted successfully',
        data: null
    })
})

export const getUserProfile = asyncHandler(async (req:Request, res:Response) =>{
    const user = await User.findById(req.user._id).select('-password')

    if (!user) {
        throw new CustomError('User not found', 404)
    }

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User profile fetched successfully',
        data: user
    })

})