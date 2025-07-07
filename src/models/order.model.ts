import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from "../types/global.types";

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        reuired:[true,'user is required'],
        ref:'user'
    },
    orderId:{
        type:String,
        required:true,
        default:`ORD-${uuidv4().split('-')[0]}`
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:[true,'product is required']
            },
            quantity:{
                type:Number,
                required:[true,'product quantty is required']
            }
        }
    ],

    status:{
        type:String,
        enum:Object.values(OrderStatus),
        default:OrderStatus.PENDING
    },
    totalAmount:{
        type:Number,
        required:[true,'total amount is required']
    }
},{timestamps:true})

const Order = mongoose.model('order',orderSchema)
export default Order