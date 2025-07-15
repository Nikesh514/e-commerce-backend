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
exports.getUserProfile = exports.removeUser = exports.getUserById = exports.getAllUser = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const pagination_utils_1 = require("../utils/pagination.utils");
exports.getAllUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { query, limit, page } = req.query;
    //pagination
    const perPage = (_a = parseInt(limit)) !== null && _a !== void 0 ? _a : 10;
    const currentPage = (_b = parseInt(page)) !== null && _b !== void 0 ? _b : 1;
    //calculate skip
    const skip = (currentPage - 1) * perPage;
    const users = yield user_model_1.default.find().limit(perPage).skip(skip).sort({ createdAt: -1 }).populate("category");
    const totalData = yield user_model_1.default.countDocuments();
    const pagination = (0, pagination_utils_1.getPagination)(totalData, perPage, currentPage);
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User fetched successfully',
        data: users
    });
}));
exports.getUserById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findById(id).select('-password');
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User fetched successfully',
        data: user
    });
}));
exports.removeUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_model_1.default.findByIdAndDelete(id);
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User deleted successfully',
        data: null
    });
}));
exports.getUserProfile = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user._id).select('-password');
    if (!user) {
        throw new error_handler_middleware_1.default('User not found', 404);
    }
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'User profile fetched successfully',
        data: user
    });
}));
