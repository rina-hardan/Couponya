import express from 'express';
import couponsController from '../controllers/couponController.js';
import { verifyToken } from '../middleware/auth.js';
const couponsRouter = express.Router();

//Add Coupon
couponsRouter.post('/create',verifyToken, couponsController.createCoupon);

//GetAllActiveCoupons
couponsRouter.get('/', couponsController.getAllActiveCoupons);

//GetCouponOfBussinesOwner by BusinessOwnerId
couponsRouter.get('/BusinessOwnerCoupon/:businessOwnerId', couponsController.getCouponsByBusinessOwnerId);

//getCouponById
couponsRouter.get('/:id', couponsController.getCouponById);

//updateCoupon
couponsRouter.put('/:id',verifyToken, couponsController.updateCoupon);

couponsRouter.delete('/:id',verifyToken, couponsController.deleteCoupon);

//
couponsRouter.post('/:id/purchases',verifyToken, couponsController.getPurchasesCount);



export default couponsRouter;
