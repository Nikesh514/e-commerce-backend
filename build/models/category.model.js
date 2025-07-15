"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// category schema
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    }
}, { timestamps: true });
// creating mongoode model
const Category = mongoose_1.default.model('Category', categorySchema);
exports.default = Category;
