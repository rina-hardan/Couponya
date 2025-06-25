// cartController.js
import cartModel from "../models/cartModel.js";

const cartController = {
 addToCart: async (req, res) => {
    try {
      const { couponId, quantity, pricePerUnit,title } = req.body;
      const userId = req.userId; // אנחנו מקבלים את ה- userId מתוך הטוקן

      if (!couponId || !quantity) {
        return res.status(400).json({ error: "couponId and quantity are required" });
      }

      const result = await cartModel.addToCart(userId, couponId, quantity, pricePerUnit,title);

      if (result.success) {
        return res.status(201).json({ message: result.message });
      } else {
        return res.status(500).json({ error: "Failed to add item to cart" });
      }
    } catch (err) {
      console.error("Error in addToCart:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getCartItems: async (req, res) => {
    try {
       const userId = req.userId;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const cartItems = await cartModel.getCartItems(userId);

      res.status(200).json({ cartItems });
    } catch (err) {
      console.error("Error in getCartItems:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const { couponId } = req.body;
       const userId = req.userId;
      if (!userId || !couponId) {
        return res.status(400).json({ error: "userId and couponId are required" });
      }

      const result = await cartModel.removeFromCart(userId, couponId);

      if (result.success) {
        return res.status(200).json({ message: "Item removed from cart successfully" });
      } else {
        return res.status(500).json({ error: "Failed to remove item from cart" });
      }
    } catch (err) {
      console.error("Error in removeFromCart:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateItemQuantity: async (req, res) => {
    try {
      const { couponId, quantity } = req.body; // קבלת couponId וכמות מעודכנת מה-body של הבקשה
      const userId = req.userId; // קבלת userId מתוך הטוקן (המשתמש המחובר)

      // וידוא שהמשתמש שלח את הנתונים הדרושים
      if (!couponId || !quantity) {
        return res.status(400).json({ error: "couponId and quantity are required" });
      }

      // קריאה ל-model לעדכון הכמות
      const result = await cartModel.updateItemQuantity(userId, couponId, quantity);

      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(500).json({ error: result.message });
      }
    } catch (err) {
      console.error("Error in updateItemQuantity:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default cartController;
