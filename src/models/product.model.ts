import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, " name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, " price is required"],
        min: [0, "price cannot be negative"]
    },
    // brand:{
        
    // },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "category is required"],
    },
    stock:{
        type: Number,
        required: [true, " stock is required"],
        min: [0, "stock cannot be negative"]
    },
    coverImage:{
        path:{
            type: String,
            required: true
        },
        public_id:{
            type: String,
            required: true
        },
    },
    images:[
        {
            path:{
                type: String,
            },
            public_id:{
                type: String,
            }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
    },
},{timestamps: true});

const Product = mongoose.model("product", productSchema);

export default Product;