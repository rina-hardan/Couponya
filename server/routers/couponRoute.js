import express from 'express';
import couponsController from '../controllers/couponController.js';
const couponsRouter = express.Router();
// יצירת קופון חדש (על ידי בעל עסק)
couponsRouter.post('/create', couponsController.createCoupon);

// קבלת כל הקופונים (למשתמשים לצפייה)
couponsRouter.get('/', couponsController.getAllCoupons);

// קבלת פרטי קופון ספציפי לפי id
couponsRouter.get('/:id', couponsController.getCouponById);

couponsRouter.get('/myCoupons/:id', couponsController.getCouponByOwnerBusinessId);

// עדכון קופון (רק בעל העסק שיצר אותו)
couponsRouter.put('/:id', couponsController.updateCoupon);

// מחיקת קופון (רק בעל העסק שיצר אותו)
couponsRouter.delete('/:id', couponsController.deleteCoupon);

// צפייה בכמות הקופונים שנקנו עבור קופון מסוים (לבעל העסק)
couponsRouter.get('/:id/purchases', couponsController.getCouponPurchasesCount);

export default couponsRouter;
