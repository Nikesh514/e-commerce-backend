import { ConnectionStates } from "mongoose";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import User from "../models/user.model";
import Product from "../models/product.model";
import { Request, Response } from "express";


export const create = asyncHandler(async(req:Request,res:Response)=>{

    const userId = req.user._id;

    const {productId} = req.body

    if(!productId){
        throw new CustomError('product id is required', 400)
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new CustomError('product not found', 404)
    }

    const user = await User.findById(userId)

    if(!user){
        throw new CustomError('user not found', 404)
    }



    const isProductAlreadyExists = user.wishlist.find((wishlistProduct)=> wishlistProduct.toString() !== product._id.toString())

    console.log(isProductAlreadyExists);

    if(isProductAlreadyExists) {
     user.wishlist = user.wishlist.filter((product)=> product !== product._id)
    }else{
        user.wishlist.push(product._id)
    }

    await user.save()

    res.status(201).json({
        message:`${isProductAlreadyExists ? 'Removed from' : 'Added to'} wishlist`,
        status:'success',
        success:true,
        data:user.wishlist
    })

})


export const clear = asyncHandler(async(req:Request, res:Response)=>{

    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user){
        throw new CustomError('User not found', 404)
    }

    user.wishlist = []

    await user.save()

    res.status(200).json({
        message:`wishlist cleared`,
        status:'success',
        success:true,
        data: null
    })

})

export const getall = asyncHandler(async(req:Request, res:Response)=>{

    const userId = req.user._id
    const user = await User.findById(userId)

    if(!user){
        throw new CustomError('User not found', 404)
    }

    user.wishlist = []

    await user.save()

    res.status(200).json({
        message:`wishlist cleared`,
        status:'success',
        success:true,
        data: null
    })

})