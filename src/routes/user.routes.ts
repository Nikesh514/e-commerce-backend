import express from 'express'
import { getAllUser, getUserById, getUserProfile, removeUser } from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { onlyAdmin } from '../types/global.types';


const router = express.Router();

router.get('/', authenticate(onlyAdmin), getAllUser)
router.get('/:id', authenticate(onlyAdmin), getUserById)
router.delete('/:id', authenticate(onlyAdmin), removeUser)

router.get('/profile', authenticate(), getUserProfile)

export default router

