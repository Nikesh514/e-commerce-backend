"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), category_controller_1.create);
router.get('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.getCart);
router.post('/clear', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), cart_controller_1.clear);
exports.default = router;
