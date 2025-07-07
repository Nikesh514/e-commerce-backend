import express from 'express'
import { authenticate } from '../middlewares/authenticate.middleware';
import { onlyAdmin, onlyAdminAndUser, onlyUser } from '../types/global.types';
import { cancelOrderByUser, create, getAllByUserId, getAllOrders, remove, updateStatus } from '../controllers/order.controller';



const router = express.Router();

router.post('/',authenticate(onlyUser),create)
router.delete('/:id',authenticate(onlyAdmin),remove)
router.get('/',authenticate(onlyAdmin),getAllOrders)
router.get('/user',authenticate(onlyUser),getAllByUserId)
router.get('/:id',authenticate(onlyAdminAndUser),getAllByUserId)

router.put('/:id',authenticate(onlyAdmin),updateStatus)
router.put('/cancle/:id',authenticate(onlyUser),cancelOrderByUser)


export default router




// mail 

// pagination / query
