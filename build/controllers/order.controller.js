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
exports.cancelOrderByUser = exports.updateStatus = exports.getById = exports.remove = exports.getAllByUserId = exports.getAllOrders = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const global_types_1 = require("../types/global.types");
const pagination_utils_1 = require("../utils/pagination.utils");
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
const html_utils_1 = require("../utils/html.utils");
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: user, email } = req.user;
    const { items } = req.body;
    const orderItems = JSON.parse(items);
    const orderProducts = orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield product_model_1.default.findById(item.product);
        if (!product) {
            return null;
        }
        return {
            product: product._id,
            quantity: item.quantity,
            totalPrice: product.price * item.quantity,
        };
    }));
    const products = yield Promise.all(orderProducts);
    const filteredItems = products.filter((item) => item !== null);
    const totalAmount = filteredItems
        .reduce((acc, item) => {
        return (acc += item === null || item === void 0 ? void 0 : item.totalPrice);
    }, 0)
        .toFixed(2);
    const order = new order_model_1.default({ user, items: filteredItems, totalAmount });
    const newOrder = yield (yield order.save()).populate("items.product");
    yield (0, nodemailer_utils_1.sendEmail)({ to: email, subject: 'Order Placed Successfully', html: (0, html_utils_1.order_confirmation_html)(newOrder.items, Number(totalAmount), req.user, order, req) });
    res.status(201).json({
        message: "Order placed successfully",
        success: true,
        status: "success",
        data: newOrder,
    });
}));
// get all orders (only admin)
exports.getAllOrders = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, limit, page } = req.query;
    // pagination
    const perPage = parseInt(limit) || 10;
    const currentPage = parseInt(page) || 1;
    const skip = (currentPage - 1) * perPage;
    const allOrders = yield order_model_1.default.find().populate("user", "-password").populate("items.product").sort({ createdAt: -1 });
    const totalData = yield order_model_1.default.countDocuments();
    const pagination = (0, pagination_utils_1.getPagination)(totalData, perPage, currentPage);
    res.status(200).json({
        message: "All orders fetched",
        status: "success",
        success: true,
        data: allOrders,
    });
}));
// get all order for user (only user)
exports.getAllByUserId = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const allOrders = yield order_model_1.default.find({ user })
        .populate("user", "-password")
        .populate("items.product")
        .sort({ createdAt: -1 });
    res.status(200).json({
        message: "All orders fetched",
        status: "success",
        success: true,
        data: allOrders,
    });
}));
// delete order (admin)
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const deletedOrder = yield order_model_1.default.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        throw new error_handler_middleware_1.default("Order not found", 400);
    }
    res.status(200).json({
        message: "Order deleted successfully.",
        status: "success",
        success: true,
        data: deletedOrder,
    });
}));
// get order by id (user , admin )
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const order = yield order_model_1.default.findById(orderId)
        .populate("user", "-password")
        .populate("items.product");
    res.status(200).json({
        message: "Order fetched",
        status: "success",
        success: true,
        data: order,
    });
}));
// update order status
exports.updateStatus = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new error_handler_middleware_1.default("status is required", 400);
    }
    const order = yield order_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
        throw new error_handler_middleware_1.default("order not found", 400);
    }
    res.status(200).json({
        message: "Order status updated",
        status: "success",
        success: true,
        data: order,
    });
}));
// user cancel order
exports.cancelOrderByUser = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = req.user._id;
    const order = yield order_model_1.default.findById(id);
    if (!order) {
        throw new error_handler_middleware_1.default("Order not found", 404);
    }
    if (((_a = order.user) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString()) {
        throw new error_handler_middleware_1.default("You are not authorized to cancel this order", 403);
    }
    order.status = global_types_1.OrderStatus.CANCELED;
    yield order.save();
    res.status(200).json({
        message: "Order canceled successfully",
        status: "success",
        success: true,
        data: order,
    });
}));
