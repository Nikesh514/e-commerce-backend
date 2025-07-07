import mongoose from "mongoose";

// category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required' ],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    }
},{timestamps:true})

// creating mongoode model
const Category = mongoose.model ('Category', categorySchema)

export default Category