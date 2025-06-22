import DB from "../DB/DBconnection.js"; 

const regionsModel = {
  addRegion: async ({ name, img_url }) => {
    try {
      const sql = `INSERT INTO regions (name, img_url) VALUES (?, ?)`;
      const [result] = await DB.query(sql, [name, img_url]);

      return { success: true, id: result.insertId };
    } catch (err) {
      console.error("Error in addRegion:", err);
      return { success: false, error: err.message };
    }
  },

  getRegions: async () => {
    try {
      const sql = `SELECT * FROM regions ORDER BY name ASC`;
      const [rows] = await DB.query(sql);
      return rows;
    } catch (err) {
      console.error("Error in getRegions:", err);
      throw err;
    }
  }
};

export default regionsModel;