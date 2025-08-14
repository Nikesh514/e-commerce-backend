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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedProducts = exports.remove = exports.update = exports.getById = exports.getAll = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// import path from "path"
const category_model_1 = __importDefault(require("../models/category.model"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const pagination_utils_1 = require("../utils/pagination.utils");
// import { IImages } from "../types/global.types";
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { category: categoryId } = _a, data = __rest(_a, ["category"]);
    const { coverImage, images } = req.files;
    console.log(coverImage);
    if (!coverImage || coverImage.length === 0) {
        throw new error_handler_middleware_1.default("coverImage is required", 404);
    }
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        throw new error_handler_middleware_1.default('category not found', 404);
    }
    const product = new product_model_1.default(data);
    product.category = category._id;
    //? add product cover image
    product.coverImage = {
        path: coverImage[0].path,
        public_id: coverImage[0].filename,
    };
    //? add product image
    if (Array.isArray(images) && images.length > 0) {
        const imagePath = images.map(image => ({
            path: image.path,
            public_id: image.filename,
        }));
        // product.images = imagePath as any;
        product.set('images', imagePath);
    }
    yield product.save();
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Product created successfully',
        data: product
    });
}));
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { query, minPrice, maxPrice, category, brand, page, limit } = req.query;
    const filter = {};
    // pagination
    const perPage = (_a = parseInt(limit)) !== null && _a !== void 0 ? _a : 10;
    const currentPage = (_b = parseInt(page)) !== null && _b !== void 0 ? _b : 1;
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
    if (category) {
        filter.category = category;
    }
    if (brand) {
        filter.brand = brand;
    }
    if (minPrice || maxPrice) {
        if (minPrice && maxPrice) {
            filter.price = {
                $lte: Number(maxPrice),
                $gte: Number(minPrice)
            };
        }
        if (minPrice) {
            filter.price = {
                $gte: Number(minPrice)
            };
        }
        if (maxPrice) {
            filter.price = {
                $lte: Number(maxPrice)
            };
        }
    }
    const products = yield product_model_1.default.find(filter).limit(perPage).skip(skip).sort({ createdAt: -1 }).populate("category");
    const totalData = yield product_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(totalData, perPage, currentPage);
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Products fetched successfully',
        data: {
            data: products,
            pagination
        }
    });
}));
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield product_model_1.default.findOne({ _id: id }).populate("category");
    if (!product_model_1.default) {
        throw new error_handler_middleware_1.default('Product not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    });
}));
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { coverImage, images } = req.files;
    let { deletedImage, name, category, stock, isFeatured, description, price } = req.body;
    deletedImage = JSON.parse(deletedImage !== null && deletedImage !== void 0 ? deletedImage : "");
    console.log(deletedImage);
    if (category) {
        const productCategory = yield category_model_1.default.findById(category);
        if (!productCategory) {
            throw new error_handler_middleware_1.default('Category not found', 404);
        }
    }
    const product = yield product_model_1.default.findByIdAndUpdate(id, { name, category, stock, isFeatured, description, price }, {
        new: true,
        runValidators: true
    });
    if (!product) {
        throw new error_handler_middleware_1.default("Product not found", 404);
    }
    // update cover image
    if (coverImage) {
        if (product.coverImage) {
            yield (0, cloudinary_config_1.removeImages)([product.coverImage.public_id]);
        }
        product.coverImage = {
            path: coverImage[0].path,
            public_id: coverImage[0].filename
        };
    }
    //
    if (Array.isArray(deletedImage) && deletedImage.length > 0) {
        yield (0, cloudinary_config_1.removeImages)(deletedImage);
        if (product.images) {
            product.images = (_a = product.images.filter((img) => !deletedImage.includes(img.public_id))) !== null && _a !== void 0 ? _a : [];
        }
    }
    if (images && images.length > 0) {
        // update images
        const newImages = images.map((img) => ({
            path: img.path,
            public_id: img.filename,
        }));
        product.set('images', [...product.images, ...newImages]);
    }
    yield product.save;
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    });
}));
// delete product
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // get product
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new error_handler_middleware_1.default('Product not found', 404);
    }
    // 2.product image -> delete
    if (product.coverImage) {
        yield (0, cloudinary_config_1.removeImages)([product.coverImage.public_id]);
    }
    // delete product images
    if (product.images && product.images.length > 0) {
        const imageIds = product.images.map((image) => image.public_id);
        yield (0, cloudinary_config_1.removeImages)(imageIds);
    }
    // 3. delete product
    yield product.deleteOne();
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'product fetched successfully',
        data: product
    });
}));
//? get all featured products
exports.getFeaturedProducts = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const featured = yield product_model_1.default.find({ isFeatured: true }).populate('category');
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Featured products fetched successfully',
        data: featured
    });
}));
