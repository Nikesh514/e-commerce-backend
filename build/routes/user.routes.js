"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.get('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.getAllUser);
router.get('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.getUserById);
router.delete('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), user_controller_1.removeUser);
router.get('/profile', (0, authenticate_middleware_1.authenticate)(), user_controller_1.getUserProfile);
exports.default = router;
