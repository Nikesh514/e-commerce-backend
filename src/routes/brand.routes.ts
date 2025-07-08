import express from 'express'
import { create, getAll, getAllById, remove, update } from '../controllers/brand.controller'
import { uploader } from '../middlewares/file-uploader.middleware'
import { authenticate } from '../middlewares/authenticate.middleware'
import { onlyAdmin } from '../types/global.types'


const upload = uploader()
const router = express.Router()

router.get('/', getAll)
router.get('/:id', getAllById)

router.post('/', authenticate(onlyAdmin),
    upload.fields([{ name: 'logo', maxCount: 1}]),
    create
)

router.put('/:id', authenticate(onlyAdmin),
    upload.fields([{ name: 'logo', maxCount: 1}]),
    update
)

router.delete('/:id', authenticate(onlyAdmin), remove);
export default router;


