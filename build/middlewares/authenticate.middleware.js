"use strict";
// auth middlewares
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
exports.authenticate = void 0;
const error_handler_middleware_1 = __importDefault(require("./error-handler.middleware"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticate = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 1. get token from req (req.cookie)
            const token = req.cookies.access_token;
            console.log(token);
            if (!token) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied', 401);
            }
            const decodedData = (0, jwt_utils_1.decodeJWTToken)(token);
            console.log(decodedData);
            if (!decodedData) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied', 401);
            }
            if (!decodedData.exp || decodedData.exp * 1000 > Date.now()) {
                res.clearCookie('access_token', {
                    httpOnly: true
                });
                throw new error_handler_middleware_1.default('Token Expired. Access denied', 401);
            }
            // ? check if user exists or not
            const user = yield user_model_1.default.findOne({ email: decodedData.email });
            if (!user) {
                throw new error_handler_middleware_1.default('Unauthorized. Access denied', 401);
            }
            // check if user is valid or not
            if (roles && !roles.includes(user.role)) {
                throw new error_handler_middleware_1.default('Forbidden. Access denied', 403);
            }
            req.user = {
                _id: user._id,
                role: user.role,
                email: user.email,
                full_Name: user.full_name
            };
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.authenticate = authenticate;
