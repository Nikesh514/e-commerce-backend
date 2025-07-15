"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const file_uploader_middleware_1 = require("../middlewares/file-uploader.middleware");
const upload = (0, file_uploader_middleware_1.uploader)();
const router = express_1.default.Router();
router.get('/', category_controller_1.getAll);
router.get('/:id', category_controller_1.getById);
router.post('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]), category_controller_1.create);
router.put('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
]), category_controller_1.update);
router.delete('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), category_controller_1.remove);
exports.default = router;
