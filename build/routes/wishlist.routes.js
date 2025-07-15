"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), wishlist_controller_1.create);
router.delete('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyUser), wishlist_controller_1.clear);
exports.default = router;
