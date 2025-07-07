import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Cart from "../models/cart.model";
import CustomError from "../middlewares/error-handler.middleware";
import Product from "../models/product.model";
import mongoose from "mongoose";


export const create = asyncHandler(async(req:Request, res:Response)=>{
    const {productId, quantity} = req.body

    const user = req.user._id

    let cart;

    if(!productId){
        throw new CustomError('productId is not required', 400)
    }

    cart = await Cart.findOne({user})

    if(!cart){
        cart = new Cart ({user,items:[]})
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new CustomError('product is not required', 400)
    }

    //! to check if same product already exists on cart
    const productAlreadyExists = cart.items.find((item) => item.product.toString() === productId)
    if(productAlreadyExists){
        //! if product already exists only update new quantity for that product
        productAlreadyExists.quantity = parseInt(quantity)
    }else{
    //! else add new item on cart
        cart.items.push({product:productId, quantity})
    }

    await cart.save()

    res.status(201).json({
        message:'Cart created',
        success:true,
        status:'sccuess',
        data: cart
    })
})

// clear cart
export const clear = asyncHandler(async(req:Request, res:Response)=>{

    const user = req.user._id

    const cart = await Cart.findOneAndUpdate({user:new mongoose.Types.ObjectId(user)},{items:[]},{new:true})

    if(!cart){
        throw new CustomError ('cart not found', 400)
    }

    res.status(200).json({
        status:'success',
        success:true,
        message:'cart cleared successfully',
        data:cart
    })
})

export const getCart = asyncHandler(async(req:Request, res:Response)=>{
    const user = req.user._id

    const cart = await Cart.findOne({user}).populate('user','-password').populate('items.product')

    if(!cart){
        throw new CustomError('cart is not created yet', 400)
    }

    res.status(200).json({
        message: 'Cart fetched',
        success: true,
        status: 'success',
        data: cart
    })
})