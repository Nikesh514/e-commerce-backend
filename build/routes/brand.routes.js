"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("../controllers/brand.controller");
const file_uploader_middleware_1 = require("../middlewares/file-uploader.middleware");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const global_types_1 = require("../types/global.types");
const upload = (0, file_uploader_middleware_1.uploader)();
const router = express_1.default.Router();
router.get('/', brand_controller_1.getAll);
router.get('/:id', brand_controller_1.getAllById);
router.post('/', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([{ name: 'logo', maxCount: 1 }]), brand_controller_1.create);
router.put('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), upload.fields([{ name: 'logo', maxCount: 1 }]), brand_controller_1.update);
router.delete('/:id', (0, authenticate_middleware_1.authenticate)(global_types_1.onlyAdmin), brand_controller_1.remove);
exports.default = router;
