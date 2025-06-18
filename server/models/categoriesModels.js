import DB from "../DB/DBconnection.js";

const categoriesModel = {
  addCategory: async ({ name }) => {
    try {
      const sql = `INSERT INTO categories (name) VALUES (?)`;
      const [result] = await DB.query(sql, [name]);
      return { success: true, id: result.insertId };
    } catch (err) {
      console.error("Error in addCategory:", err);
      return { success: false, error: err.message };
    }
  },

  getCategories: async () => {
    try {
      const sql = `SELECT * FROM categories ORDER BY name ASC`;
      const [rows] = await DB.query(sql);
      return rows;
    } catch (err) {
      console.error("Error in getCategories:", err);
      throw err;
    }
  },
   getUnConfirmedCoupons: async () => {
    try {
      const sql = `SELECT * FROM coupons WHERE status = 'pending'`;
      const [rows] = await DB.query(sql);
      return rows;
    } catch (err) {
      console.error("Error in getUnConfirmedCoupons:", err);
      throw err;
    }
}
};

export default categoriesModel;
