import couponsModel from "../models/couponModels.js";
import usersModel from "../models/usersModels.js";

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

  // getAllActiveCoupons: async (req, res) => {
  //   try {
  //     const coupons = await couponsModel.getAllActive();
  //     res.status(200).json(coupons);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error retrieving active coupons", error: error.message });
  //   }
  // },
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

  // getCouponsByBusinessOwnerId: async (req, res) => {
  //   try {
  //     const { businessOwnerId } = req.params;
  //     const coupons = await couponsModel.getCouponsByBusinessOwnerId(businessOwnerId);
  //     res.status(200).json(coupons);
  //   } catch (error) {
  //     res.status(500).json({ message: "Error retrieving coupons for business owner", error: error.message });
  //   }
  // },
  getCouponsByBusinessOwnerId: async (req, res) => {
    try {
      const { businessOwnerId } = req.params;

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
      res.status(500).json({ message: "Error retrieving coupons for business owner", error: error.message });
    }
  }
  ,
  confirmCoupon: async (req, res) => {
    try {
      const  {couponId}  = req.params;
      const confirmed = await couponsModel.confirmCoupon(couponId);
      if (confirmed) {
        res.status(200).json({ message: "Coupon confirmed successfully" });
      } else {
        res.status(404).json({ message: "Coupon not found or already confirmed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error confirming coupon", error: error.message });
    }
  },
  getUnConfirmedCoupons: async (req, res) => {
    try {
      const coupons = await couponsModel.getUnConfirmedCoupons();
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving unconfirmed coupons", error: error.message });
    }
  },
  getRecommendedCoupons: async (req, res) => {
    const userId = req.userId;
    const email = req.userEmail;

    try {
      const user = await usersModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const birth_date = user.birth_date;
      const address = user.address;

      if (!birth_date) {
        return res.status(400).json({ error: "Birth date is missing" });
      }

      const age = calculateAge(birth_date);

      // if (!address || address.trim() === "") {
      //   return res.status(400).json({ error: "Address is missing or invalid" });
      // }

      // const city = extractCityFromAddress(address);
      // if (!city) {
      //   return res.status(400).json({ error: "Could not determine city from address" });
      // }

      const byAge = await couponsModel.getCouponsByAge(age - 5, age + 5);
      const byRegion = await couponsModel.getCouponsByRegion(city);
      const general = await couponsModel.getAllActive();

      const recommended = mergeAndRankCoupons(byAge, byRegion, general);

      res.status(200).json({ recommended });

    } catch (error) {
      console.error("Error in getRecommended:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default couponsController;
