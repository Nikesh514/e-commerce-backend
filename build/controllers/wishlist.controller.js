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
exports.getall = exports.clear = exports.create = void 0;
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const async_handler_utils_1 = require("../utils/async-handler.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!productId) {
        throw new error_handler_middleware_1.default('product id is required', 400);
    }
    const product = yield product_model_1.default.findById(productId);
    if (!product) {
        throw new error_handler_middleware_1.default('product not found', 404);
    }
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('user not found', 404);
    }
    const isProductAlreadyExists = user.wishlist.find((wishlistProduct) => wishlistProduct.toString() !== product._id.toString());
    console.log(isProductAlreadyExists);
    if (isProductAlreadyExists) {
        user.wishlist = user.wishlist.filter((product) => product !== product._id);
    }
    else {
        user.wishlist.push(product._id);
    }
    yield user.save();
    res.status(201).json({
        message: `${isProductAlreadyExists ? 'Removed from' : 'Added to'} wishlist`,
        status: 'success',
        success: true,
        data: user.wishlist
    });
}));
exports.clear = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    user.wishlist = [];
    yield user.save();
    res.status(200).json({
        message: `wishlist cleared`,
        status: 'success',
        success: true,
        data: null
    });
}));
exports.getall = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    user.wishlist = [];
    yield user.save();
    res.status(200).json({
        message: `wishlist cleared`,
        status: 'success',
        success: true,
        data: null
    });
}));
