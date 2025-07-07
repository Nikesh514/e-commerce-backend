import express from "express";
import { create } from "../controllers/category.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { onlyUser } from "../types/global.types";
import { clear, getCart } from "../controllers/cart.controller";

const router = express.Router()

router.post('/',authenticate(onlyUser), create)
router.get('/',authenticate(onlyUser),getCart)
router.post('/clear',authenticate(onlyUser),clear)



export default router;