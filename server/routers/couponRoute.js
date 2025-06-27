import express from 'express';
import couponsController from '../controllers/couponController.js';
import { isAdmin, verifyToken } from '../middleware/auth.js';
const couponsRouter = express.Router();

//Add Coupon
couponsRouter.post('/create',verifyToken, couponsController.createCoupon);

couponsRouter.get('/', couponsController.getAllActiveCoupons);

//GetCouponOfBussinesOwner by BusinessOwnerId
couponsRouter.get('/BusinessOwnerCoupons',verifyToken, couponsController.getCouponsByBusinessOwnerId);

//getCouponById
couponsRouter.get('/unconfirmedCoupons',verifyToken,isAdmin, couponsController.getUnConfirmedCoupons);
couponsRouter.post('/recommendedCoupons',verifyToken, couponsController.getRecommendedCoupons);
couponsRouter.get('/:id', couponsController.getCouponById);

couponsRouter.put('/confirmCoupon/:couponId',verifyToken,isAdmin, couponsController.confirmCoupon);
couponsRouter.put('/:id',verifyToken, couponsController.updateCoupon);
couponsRouter.delete('/:id',verifyToken, couponsController.deleteCoupon);


export default couponsRouter;
