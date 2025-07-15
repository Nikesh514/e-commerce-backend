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
exports.remove = exports.update = exports.getAllById = exports.getAll = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cloudinary_config_1 = require("../config/cloudinary.config");
const pagination_utils_1 = require("../utils/pagination.utils");
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const { logo } = req.files;
    if (!logo || logo.length === 0) {
        throw new error_handler_middleware_1.default('Brand logo is required', 400);
    }
    const brand = new brand_model_1.default({
        name,
        description,
        logo: {
            path: logo[0].path,
            public_id: logo[0].filename
        }
    });
    yield brand.save();
    res.status(201).json({
        status: 'success',
        success: true,
        message: 'Brand created successfully',
        data: brand
    });
}));
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { query, limit, page } = req.query;
    const filter = {};
    // pagination
    const perPage = (_a = parseInt(limit)) !== null && _a !== void 0 ? _a : 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * perPage;
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
        ];
    }
    const brands = yield brand_model_1.default.find(filter).limit(perPage).skip(skip).sort({ createdAt: -1 }).populate('logo');
    const totalData = yield brand_model_1.default.countDocuments(filter);
    const pagination = (0, pagination_utils_1.getPagination)(totalData, perPage, currentPage);
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand fetched successfually',
        data: brands
    });
}));
exports.getAllById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default('Brand not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand fetched successfully',
        data: brand
    });
}));
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, description } = req.body;
    const { logo } = req.files;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default('Brand not found', 404);
    }
    brand.name = name !== null && name !== void 0 ? name : brand.name;
    brand.description = description !== null && description !== void 0 ? description : brand.description;
    if (logo && logo.length > 0) {
        if ((_a = brand.logo) === null || _a === void 0 ? void 0 : _a.public_id) {
        }
    }
    yield brand.save();
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Brand updated successfully',
        data: brand
    });
}));
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const brand = yield brand_model_1.default.findById(id);
    if (!brand) {
        throw new error_handler_middleware_1.default('Brand not found', 404);
    }
    if ((_a = brand.logo) === null || _a === void 0 ? void 0 : _a.public_id) {
        yield (0, cloudinary_config_1.removeImages)([brand.logo.public_id]);
    }
    yield brand.deleteOne();
    res.status(200).json({
        status: "success",
        success: true,
        message: "Brand deleted successfully",
        data: brand,
    });
}));
