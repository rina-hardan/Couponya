import couponsModel from "../models/couponModels.js";
import usersModel from "../models/usersModels.js";
import { calculateAge, mergeAndRankCoupons } from "../utils/helpers.js";

const couponsController = {
  createCoupon: async (req, res) => {
    try {

      const couponData = req.body;
      couponData.business_owner_id = req.userId; // Assuming userId is the business owner's ID
      const newCoupon = await couponsModel.create(couponData);
      res.status(201).json(newCoupon);
    } catch (error) {
      res.status(500).json({ message: "Error creating coupon"+ error.message });
    }
  },
  getAllActiveCoupons: async (req, res) => {
    try {
      const {
        categoryId,
        regionId,
        minPrice,
        maxPrice,
        search,
        sort = "expiry_date_asc",
        page = 1,
        limit = 10
      } = req.query;

      const offset = (page - 1) * limit;

      const coupons = await couponsModel.getAllActive({
        categoryId,
        regionId,
        minPrice,
        maxPrice,
        search,
        sort,
        limit,
        offset
      });

      res.status(200).json(coupons);
    } catch (error) {
      console.error("Error retrieving active coupons:", error);
      res.status(500).json({ message: "Error retrieving active coupons"+error.message });
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
      res.status(500).json({ message: "Error retrieving coupon"+ error.message });
    }
  },

  updateCoupon: async (req, res) => {
    try {
      const { id } = req.params;
      const incomingData = req.body;
      const allowedFields = [
        "category_id",
        "region_id",
        "title",
        "description",
        "original_price",
        "discounted_price",
        "address",
        "quantity",
        "expiry_date",
        "is_active"
      ];

      const requiredFields = ["title", "discounted_price", "quantity","original_price",
        "expiry_date", "category_id", "region_id"];

      for (const field of requiredFields) {
        if (
          incomingData.hasOwnProperty(field) &&
          (incomingData[field] === "" || incomingData[field] === null)
        ) {
          return res.status(400).json({ message: `Field '${field}' cannot be empty` });
        }
      }

      const filteredData = {};
      for (const [key, value] of Object.entries(incomingData)) {
        if (
          allowedFields.includes(key) &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          filteredData[key] = value;
        }


      }
      const updated = await couponsModel.update(id, filteredData);
      if (updated) {
        res.status(200).json({ message: "Coupon updated successfully" });
      } else {
        res.status(404).json({ message: "Coupon not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error updating coupon"+ error.message });
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
      res.status(500).json({ message: "Error deleting coupon"+ error.message });
    }
  },

  getCouponsByBusinessOwnerId: async (req, res) => {
    try {
      const businessOwnerId = req.userId;

      const { isActive, status, sortBy, sortOrder, page = 1, limit = 20 } = req.query;

      const offset = (page - 1) * limit;

      const coupons = await couponsModel.getCouponsByBusinessOwnerId({
        businessOwnerId,
        isActive: isActive === undefined ? undefined : isActive === 'true',
        status,
        sortBy,
        sortOrder,
        limit,
        offset,
      });

      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving coupons for business owner"+ error.message });
    }
  }
  ,
  confirmCoupon: async (req, res) => {
    try {
      const { couponId } = req.params;
      const confirmed = await couponsModel.confirmCoupon(couponId);
      if (confirmed) {
        res.status(200).json({ message: "Coupon confirmed successfully" });
      } else {
        res.status(404).json({ message: "Coupon not found or already confirmed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error confirming coupon"+error.message });
    }
  },
  getUnConfirmedCoupons: async (req, res) => {
    try {
      const coupons = await couponsModel.getUnConfirmedCoupons();
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving unconfirmed coupons"+ error.message });
    }
  },
  getRecommendedCoupons: async (req, res) => {
    const email = req.email;

      const {birth_date,region_id} = req.body;

      if (!birth_date) {
        return res.status(400).json({ error: "Birth date is missing" });
      }

    try {
    
      const age = calculateAge(birth_date);


      const byAge = await couponsModel.getCouponsByAge(age - 5, age + 5);
      const byRegion = await couponsModel.getCouponsByRegion(region_id);
      const general = await couponsModel.getAllActiveAndPopularity();

      const recommended = mergeAndRankCoupons(byAge, byRegion, general);

      res.status(200).json({ recommended });

    } catch (error) {
      console.error("Error in getRecommended:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default couponsController;
