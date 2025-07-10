import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Product from "../models/product.model";
import CustomError from "../middlewares/error-handler.middleware";
// import path from "path"
import Category from "../models/category.model";
import { removeImages } from "../config/cloudinary.config";
// import { IImages } from "../types/global.types";



export const create = asyncHandler(async (req:Request, res:Response)=>{
    const {category:categoryId, ...data} = req.body;
    const {coverImage, images} = req.files as {
        coverImage: Express.Multer.File[];
        images: Express.Multer.File[]
    };

    console.log(coverImage)
    if(!coverImage || coverImage.length === 0) {
        throw new CustomError ("coverImage is required", 404)
    }
    
    const category = await Category.findById(categoryId)
    
    if(!category){
        throw new CustomError('category not found', 404)
    }
    
    const product = new Product(data);

    product.category = category._id

    //? add product cover image
    product.coverImage = {
        path:coverImage[0].path,
        public_id: coverImage[0].filename,
    }

    //? add product image
    if (Array.isArray(images) && images.length > 0) {
        const imagePath : {path: string; public_id: string}[] = images.map (image => ({
            path: image.path,
            public_id: image.filename,
        }))

        // product.images = imagePath as any;
        product.set('images', imagePath)
    }

    await product.save()

    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Product created successfully',
        data: product
    })

})

export const getAll = asyncHandler(async(req:Request, res:Response)=>{

    const {query,minPrice,maxPrice,category} = req.query
    const filter:Record<string,any> = {}

    console.log(query)

    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: 'name',
                    $options: 'i'
                },
            },
            {
                description: {
                    $regex: 'name',
                    $options: 'i'
                }
            }
        ]
    }

    if(category) {
        filter.category = category
    }

    if(minPrice || maxPrice) {
        
        if(minPrice && maxPrice){
            filter.price={
                $lte:Number(maxPrice as string),
                $gte:Number(minPrice as string)
            }
        }
        if(minPrice){
            filter.price={
                $gte:Number(minPrice as string)
            }
        }
        if(maxPrice){
            filter.price={
                $lte:Number(maxPrice as string)
            }
        }
    }


    const products = await Product.find(filter).populate("category");
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Products fetched successfully',
        data: products
    })
})

export const getById = asyncHandler(async (req:Request, res:Response)=>{
    const {id} = req.params
    const product = await Product.findOne({_id:id}).populate("category")
    if(!Product) {
        throw new CustomError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    })
})

export const update = asyncHandler(async (req:Request, res:Response)=>{
    const {id} = req.params
    const {coverImage, images} = req.files as {
        coverImage:Express.Multer.File[];
        images: Express.Multer.File[];
    }
    let {
        deletedImage, 
        name, 
        category, 
        stock, 
        isFeatured, 
        description, 
        price
    } = req.body

    deletedImage = JSON.parse(deletedImage ?? "")

    console.log(deletedImage)

    if(category) {
        const productCategory = await Category.findById(category)

        if(!productCategory){
            throw new CustomError('Category not found', 404)
        }
    }


    const product = await Product.findByIdAndUpdate(id, {name, category, stock, isFeatured, description, price}, 
        {
        new: true,
        runValidators: true
    })

    if(!product) {
        throw new CustomError("Product not found", 404)
    }

    // update cover image
    if(coverImage){
        if(product.coverImage){
        await removeImages([product.coverImage.public_id])
        }

        product.coverImage = {
            path: coverImage[0].path,
            public_id: coverImage[0].filename
        }
    }
    //
    if (Array.isArray(deletedImage) && deletedImage.length > 0) {
        await removeImages(deletedImage);
      
        if (product.images) {
          product.images = (
            product.images.filter((img) => !deletedImage.includes(img.public_id)
        ) as any) ?? [];
        }
      }
      
      if (images && images.length > 0) {
        // update images
        const newImages = images.map((img) => ({
          path: img.path,
          public_id: img.filename,
        }));
      
        product.set('images',[...product.images, ...newImages] )
      }


      await product.save;
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    })
})
// delete product
export const remove = asyncHandler(async (req:Request, res:Response)=>{
    const {id} = req.params

    // get product
    const product = await Product.findById(id)

    if(!product){
        throw new CustomError('Product not found', 404);
    }

    // 2.product image -> delete
    if(product.coverImage){
        await removeImages([product.coverImage.public_id])
    }
    // delete product images
    if(product.images && product.images.length > 0){
        const imageIds: string [] = product.images.map(
            (image) => image.public_id as string)
            await removeImages(imageIds)
        }

    // 3. delete product
    await product.deleteOne()

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    })
})