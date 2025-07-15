"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.post('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.create);
router.delete('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), order_controller_1.remove);
router.get('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), order_controller_1.getAllOrders);
router.get('/user', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.getAllByUserId);
router.get('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdminAndUser), order_controller_1.getAllByUserId);
router.put('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), order_controller_1.updateStatus);
router.put('/cancle/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), order_controller_1.cancelOrderByUser);
exports.default = router;
// mail 
// pagination / query
