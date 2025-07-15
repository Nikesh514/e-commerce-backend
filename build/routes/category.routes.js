"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
// category post route
router.post('/', (0, authenticate_middleware_1.authenticate)([global_types_1.Role.ADMIN]), category_controller_1.create);
// get all categories
router.get('/', (0, authenticate_middleware_1.authenticate)([global_types_1.Role.ADMIN]), category_controller_1.getAll);
// get by id
router.get('/:id', category_controller_1.getById);
//update category
router.put('/:id', (0, authenticate_middleware_1.authenticate)([global_types_1.Role.ADMIN]), category_controller_1.update);
// delete category
router.delete('/:id', (0, authenticate_middleware_1.authenticate)([global_types_1.Role.ADMIN]), category_controller_1.remove);
exports.default = router;
