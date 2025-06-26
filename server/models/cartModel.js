// cartModel.js
import DB from "../DB/DBconnection.js";

const cartModel = {
  addToCart: async (userId, couponId, quantity, pricePerUnit, title) => {
  try {
    const checkCouponSql = `SELECT * FROM cart_items WHERE user_id = ? AND coupon_id = ?`;
    const [existingItem] = await DB.query(checkCouponSql, [userId, couponId]);

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      const updateSql = `UPDATE cart_items SET quantity = ?, price_per_unit = ? WHERE user_id = ? AND coupon_id = ?`;
      await DB.query(updateSql, [newQuantity, pricePerUnit, userId, couponId]); // עדכון גם את המחיר במקרה של עדכון כמות
      return { success: true, message: "Quantity updated successfully" };
    } else {
      const insertSql = `INSERT INTO cart_items (user_id, coupon_id, quantity, price_per_unit, title) 
                         VALUES (?, ?, ?, ?, ?)`;
      const [result] = await DB.query(insertSql, [userId, couponId, quantity, pricePerUnit, title]);
      return { success: true, id: result.insertId, message: "Item added to cart successfully" };
    }
  } catch (err) {
    console.error("Error in addToCart:", err);
    return { success: false, error: err.message };
  }
}
,

 getCartItems: async (userId) => {
  try {
    console.log("Fetching cart items for user:", userId); // הדפסת פרטי הבקשה
    const sql = `SELECT * FROM cart_items WHERE user_id = ?`;
    const [rows] = await DB.query(sql, [userId]);
    return rows;
  } catch (err) {
    console.error("Error in getCartItems:", err);
    throw err;
  }
},

  removeFromCart: async (userId, couponId) => {
    try {
      const sql = `DELETE FROM cart_items WHERE user_id = ? AND coupon_id = ?`;
      const [result] = await DB.query(sql, [userId, couponId]);
      return { success: true };
    } catch (err) {
      console.error("Error in removeFromCart:", err);
      return { success: false, error: err.message };
    }
  },

  // קבלת המחיר המוזל של קופון
  getCouponPrice: async (couponId) => {
    try {
      const sql = `SELECT price_per_unit FROM coupons WHERE id = ?`;
      const [rows] = await DB.query(sql, [couponId]);
      return rows[0]; 
    } catch (err) {
      console.error("Error in getCouponPrice:", err);
      throw err;
    }
  },  updateItemQuantity: async (userId, couponId, newQuantity) => {
    try {
      const updateSql = `UPDATE cart_items SET quantity = ? WHERE user_id = ? AND coupon_id = ?`;
      const [result] = await DB.query(updateSql, [newQuantity, userId, couponId]);

      if (result.affectedRows > 0) {
        return { success: true, message: "Quantity updated successfully" };
      } else {
        return { success: false, message: "Item not found" };
      }
    } catch (err) {
      console.error("Error in updateItemQuantity:", err);
      return { success: false, error: err.message };
    }
  }
};

export default cartModel;
