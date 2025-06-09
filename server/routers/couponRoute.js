import express from 'express';
import couponsController from '../controllers/couponController.js';
const couponsRouter = express.Router();

//Add Coupon
couponsRouter.post('/create', couponsController.createCoupon);

//GetAllActiveCoupons
couponsRouter.get('/', couponsController.getAllActiveCoupons);

//GetCouponOfBussinesOwner by BusinessOwnerId
couponsRouter.get('/BusinessOwnerCoupon/:businessOwnerId', couponsController.getCouponsByBusinessOwnerId);

//getCouponById
couponsRouter.get('/:id', couponsController.getCouponById);

//updateCoupon
couponsRouter.put('/:id', couponsController.updateCoupon);

couponsRouter.delete('/:id', couponsController.deleteCoupon);

//
couponsRouter.get('/:id/purchases', couponsController.getPurchasesCount);



export default couponsRouter;
