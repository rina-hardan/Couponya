import express from 'express';
import couponsController from '../controllers/couponController.js';
import { isAdmin, verifyToken } from '../middleware/auth.js';
const couponsRouter = express.Router();

//Add Coupon
couponsRouter.post('/create',verifyToken, couponsController.createCoupon);

//GetAllActiveCoupons
couponsRouter.get('/', couponsController.getAllActiveCoupons);

//GetCouponOfBussinesOwner by BusinessOwnerId
couponsRouter.get('/BusinessOwnerCoupons',verifyToken, couponsController.getCouponsByBusinessOwnerId);

//getCouponById
couponsRouter.get('/unconfirmedCoupons',verifyToken,isAdmin, couponsController.getUnConfirmedCoupons);

couponsRouter.get('/:id', couponsController.getCouponById);

//updateCoupon
couponsRouter.put('/confirmCoupon/:couponId',verifyToken,isAdmin, couponsController.confirmCoupon);
couponsRouter.put('/:id',verifyToken, couponsController.updateCoupon);
couponsRouter.delete('/:id',verifyToken, couponsController.deleteCoupon);

couponsRouter.post('/:id/purchases',verifyToken, couponsController.getPurchasesCount);
couponsRouter.get('/recommendedCoupons',verifyToken, couponsController.getRecommendedCoupons);

export default couponsRouter;
