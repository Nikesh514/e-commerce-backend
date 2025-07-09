import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import CustomError from "../middlewares/error-handler.middleware";
import Brand from "../models/brand.model";
import { removeImages } from "../config/cloudinary.config";



export const create = asyncHandler(async(req: Request, res: Response) => {
    const { name, description } = req.body

    const { logo } = req.files as {
        logo: Express.Multer.File[]
    }

    if (!logo || logo.length === 0) {
        throw new CustomError('Brand logo is required', 400)
    }

    const brand = new Brand ({
        name,
        description,
        logo: {
            path: logo[0].path,
            public_id: logo[0].filename
        }

    })

    await brand.save()
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Brand created successfully',
        data: brand
    })

})

export const getAll = asyncHandler(async(req:Request, res:Response)=>{

    const { query } = req.query
    const filter: Record <string, any> = {}

    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: 'i'
                },
            },
            {
                description: {
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    }

    const brands = await Brand.find()
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand fetched successfually',
        data: brands
    })
})

export const getAllById = asyncHandler(async(req:Request, res:Response)=>{
    const {id} = req.params
    const brand = await Brand.findById(id)

    if(!brand){
        throw new CustomError('Brand not found', 404)
    }

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand fetched successfully',
        data: brand
    })
})

export const update = asyncHandler(async(req:Request, res:Response)=>{
    const {id} = req.params
    const { name, description } = req.body

    const {logo} = req.files as {
        logo: Express.Multer.File[]
    }

    const brand = await Brand.findById(id)

    if (!brand) {
        throw new CustomError('Brand not found', 404)
    }

    brand.name = name ?? brand.name
    brand.description = description ?? brand.description

    if (logo && logo.length > 0){
        if (brand.logo?.public_id) {

        }
    }
    await brand.save()

    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand updated successfully',
        data: brand
    })
})

export const remove = asyncHandler(async(req:Request, res:Response)=>{
    const {id} = req.params
    const brand = await Brand.findById(id)

    if (!brand) {
        throw new CustomError('Brand not found', 404)
    }

    if (brand.logo?.public_id) {
        await removeImages([brand.logo.public_id])
    }

    await brand.deleteOne()

    res.status(200).json({
        status: "success",
        success: true,
        message: "Brand deleted successfully",
        data: brand,
    })
})

