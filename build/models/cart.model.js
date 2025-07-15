"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required']
    },
    items: [
        {
            product: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'product',
                required: [true, 'product id is required']
            },
            quantity: {
                type: Number,
                min: 1,
                required: [true, 'quantity is required']
            }
        }
    ]
}, { timestamps: true });
const Cart = mongoose_1.default.model('cart', cartSchema);
exports.default = Cart;
