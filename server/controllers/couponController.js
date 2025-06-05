import couponsModel from '../models/couponModels.js';

const couponsController = {
  createCoupon: async (req, res) => {
    try {
      const couponData = req.body;
      const newCoupon = await couponsModel.create(couponData);
      res.status(201).json(newCoupon);
    } catch (error) {
      res.status(500).json({ message: 'Error creating coupon', error });
    }
  },

  getCouponByOwnerBusinessId: async (req, res) => {
    try {
      const businessOwnerId = req.params.id;
      const coupons = await couponsModel.getCouponsByBusinessOwnerId(businessOwnerId);
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupons for business owner', error });
    }
  },

  getAllCoupons: async (req, res) => {
    try {
      const coupons = await couponsModel.getAllActive();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupons', error });
    }
  },

  getCouponById: async (req, res) => {
    try {
      const coupon = await couponsModel.getById(req.params.id);
      if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching coupon', error });
    }
  },

  updateCoupon: async (req, res) => {
    try {
      const updated = await couponsModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Coupon not found or not authorized' });
      res.json({ message: 'Coupon updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating coupon', error });
    }
  },

  deleteCoupon: async (req, res) => {
    try {
      const deleted = await couponsModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Coupon not found or not authorized' });
      res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coupon', error });
    }
  },

  getCouponPurchasesCount: async (req, res) => {
    try {
      const count = await couponsModel.getPurchasesCount(req.params.id);
      res.json({ couponId: req.params.id, purchasedCount: count });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching purchases count', error });
    }
  }
};

export default couponsController;
