import DB from "../DB/DBconnection.js";

const categoriesModel = {
  addCategory: async ({ name, img_url }) => {
    try {
      const sql = `INSERT INTO categories (name, img_url) VALUES (?, ?)`;
      const [result] = await DB.query(sql, [name, img_url]);
      return { success: true, categoryId: result.insertId };
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
  }
};

export default categoriesModel;
