import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Category from "../models/category.model";
import CustomError from "../middlewares/error-handler.middleware";



// post catogary
export const create = asyncHandler(async (req:Request, res:Response) => {

    const {name, description} = req.body;

    const category = await Category.create({name, description})

    if(!category) {
        throw new CustomError ('something went wrong', 500)
    }

    res.status(201).json({
        message: 'Category created',
        success: true,
        stauts: 'success',
        data: category
    })

})

//get all categories

export const getAll = asyncHandler(async (req:Request, res:Response)=>{

    const {query} = req.query
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

    const categories  = await Category.find()

    res.status(200).json({
        message: 'all category fetched',
        success: true,
        status: 'success',
        data: categories
    })

})

// get by id
export const getById = asyncHandler(async (req:Request, res:Response)=>{
    //get id from params
    const {id} = req.params

    //get category by given id
    const category = await Category.findById(id)

    if(!category) {
        throw new CustomError('Category not found', 400)
    }

    res.status(200).json({
        message: `category by id ${id} fetched`,
        success: true,
        status: 'success',
        data: category
    })
})

// update category
export const update = asyncHandler(async (req:Request, res:Response)=>{

    // get id from params
    const {id} = req.params

    // get body data to update
    const {name, description} = req.body

    // find category by id
    const category = await Category.findById(id)
    // const updatedCategory = await Category.findByIdAndUpdate(id, {name, description}, {new: true})

    

    if(!category) {
        throw new CustomError('Category not found', 400)
    }

    if(name){
        category.name = name
    }

    if(description){
        category.description = description
    }

    await category.save()

    res.status(200).json({
        message: `Category updated`,
        success: true,
        status: 'success',
        data: category
    })
})

export const remove = asyncHandler(async (req:Request, res:Response)=>{

    const {id} = req.params

    const category = await Category.findByIdAndDelete(id)

    if(!category) {
        throw new CustomError('Category not found', 400)
    }

    res.status(200).json({
        message: 'Category deleted',
        success: true,
        status: 'success',
        data: null
    })

})