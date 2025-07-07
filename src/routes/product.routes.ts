import express from 'express';
import { create, getAll, getById, remove, update } from '../controllers/category.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { onlyAdmin } from '../types/global.types';

import {uploader} from '../middlewares/file-uploader.middleware';

const upload  = uploader()
const router = express.Router()

router.get('/', getAll)

router.get('/:id', getById)

router.post('/',authenticate(onlyAdmin),
upload.fields([
    {name:'coverImage', maxCount:1},
    {name: 'images', maxCount:5}]),  create)

router.put('/:id',authenticate(onlyAdmin), 
upload.fields([
    { name: "coverImage", maxCount:1},
    { name: "images", maxCount:5},
]),
update)

router.delete('/:id',authenticate(onlyAdmin), remove)


export default router;