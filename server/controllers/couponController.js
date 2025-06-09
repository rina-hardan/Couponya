import couponsModel from "../models/couponModels.js";

const couponsController = {
  createCoupon: async (req, res) => {
    try {
      const couponData = req.body;
      const newCoupon = await couponsModel.create(couponData);
      res.status(201).json(newCoupon);
    } catch (error) {
      res.status(500).json({ message: "Error creating coupon", error: error.message });
    }
  },

  getAllActiveCoupons: async (req, res) => {
    try {
      const coupons = await couponsModel.getAllActive();
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving active coupons", error: error.message });
    }
  },

  getCouponById: async (req, res) => {
    try {
      const { id } = req.params;
      const coupon = await couponsModel.getById(id);
      if (coupon) {
        res.status(200).json(coupon);
      } else {
        res.status(404).json({ message: "Coupon not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error retrieving coupon", error: error.message });
    }
  },

  updateCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await couponsModel.update(id, req.body);
      if (updated) {
        res.status(200).json({ message: "Coupon updated successfully" });
      } else {
        res.status(404).json({ message: "Coupon not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating coupon", error: error.message });
    }
  },

  deleteCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await couponsModel.delete(id);
      if (deleted) {
        res.status(200).json({ message: "Coupon deleted successfully" });
      } else {
        res.status(404).json({ message: "Coupon not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting coupon", error: error.message });
    }
  },

  getPurchasesCount: async (req, res) => {
    try {
      const { couponId } = req.params;
      const count = await couponsModel.getPurchasesCount(couponId);
      res.status(200).json({ couponId, purchasedCount: count });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving purchases count", error: error.message });
    }
  },

  getCouponsByBusinessOwnerId: async (req, res) => {
    try {
      const { businessOwnerId } = req.params;
      const coupons = await couponsModel.getCouponsByBusinessOwnerId(businessOwnerId);
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving coupons for business owner", error: error.message });
    }
  }
};

export default couponsController;
