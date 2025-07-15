"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const category_model_1 = __importDefault(require("../models/category.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// post catogary
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield category_model_1.default.create({ name, description });
    if (!category) {
        throw new error_handler_middleware_1.default('something went wrong', 500);
    }
    res.status(201).json({
        message: 'Category created',
        success: true,
        stauts: 'success',
        data: category
    });
}));
//get all categories
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, limit, page } = req.query;
    const filter = {};
    // pagination
    const perPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    // calculate skip
    const skip = (currentPage - 1) * perPage;
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
        ];
    }
    const categories = yield category_model_1.default.find().limit(perPage).skip(skip).sort({ createdAt: -1 }).populate('products');
    res.status(200).json({
        message: 'all category fetched',
        success: true,
        status: 'success',
        data: categories
    });
}));
// get by id
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get id from params
    const { id } = req.params;
    //get category by given id
    const category = yield category_model_1.default.findById(id);
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 400);
    }
    res.status(200).json({
        message: `category by id ${id} fetched`,
        success: true,
        status: 'success',
        data: category
    });
}));
// update category
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id from params
    const { id } = req.params;
    // get body data to update
    const { name, description } = req.body;
    // find category by id
    const category = yield category_model_1.default.findById(id);
    // const updatedCategory = await Category.findByIdAndUpdate(id, {name, description}, {new: true})
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 400);
    }
    if (name) {
        category.name = name;
    }
    if (description) {
        category.description = description;
    }
    yield category.save();
    res.status(200).json({
        message: `Category updated`,
        success: true,
        status: 'success',
        data: category
    });
}));
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const category = yield category_model_1.default.findByIdAndDelete(id);
    if (!category) {
        throw new error_handler_middleware_1.default('Category not found', 400);
    }
    res.status(200).json({
        message: 'Category deleted',
        success: true,
        status: 'success',
        data: null
    });
}));
