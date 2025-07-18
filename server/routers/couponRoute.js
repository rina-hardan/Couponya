import express from 'express';
import couponsController from '../controllers/couponController.js';
import { isAdmin, verifyToken } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createCouponValidator, updateCouponValidator, couponIdValidator,recommendedCouponsValidator } from '../middleware/validators/couponValidator.js';
const couponsRouter = express.Router();

//Add Coupon
couponsRouter.post('/create', verifyToken, createCouponValidator, validate, couponsController.createCoupon);

couponsRouter.get('/', couponsController.getAllActiveCoupons);

//GetCouponOfBussinesOwner by BusinessOwnerId
couponsRouter.get('/BusinessOwnerCoupons',verifyToken, couponsController.getCouponsByBusinessOwnerId);

//getCouponById
couponsRouter.get('/unconfirmedCoupons',verifyToken,isAdmin, couponsController.getUnConfirmedCoupons);
couponsRouter.post('/recommendedCoupons',verifyToken,recommendedCouponsValidator,validate, couponsController.getRecommendedCoupons);
couponsRouter.get('/:id', couponIdValidator, validate, couponsController.getCouponById);

couponsRouter.put('/confirmCoupon/:couponId', verifyToken, isAdmin, couponIdValidator, validate, couponsController.confirmCoupon);
couponsRouter.put('/:id', verifyToken, updateCouponValidator, validate, couponsController.updateCoupon);

export default couponsRouter;
