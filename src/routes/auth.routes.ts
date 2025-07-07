import express from 'express';
import { login, register } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { onlyUser } from '../types/global.types';


const router = express.Router();

// register user
router.post('/register',register)
router.post('/login',login)

export default router;