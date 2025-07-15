import express from 'express';
import { create, getAll, remove, update, getById } from '../controllers/category.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { Role } from '../types/global.types';

const router = express.Router();

// category post route
router.post('/',authenticate([Role.ADMIN]),create)

// get all categories
router.get('/', getAll)

// get by id
router.get('/:id', getById)

//update category
router.put('/:id',authenticate([Role.ADMIN]) ,update)

// delete category
router.delete('/:id',authenticate([Role.ADMIN]) ,remove )

export default router;