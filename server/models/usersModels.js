import DB from "../DB/DBconnection.js";

const usersModel = {
  register: async (userData) => {
    const { name, userName, email, password, role, created_at } = userData;
    try {
      const [result] = await DB.query(
        "INSERT INTO users (name, userName, email, role, created_at) VALUES (?, ?, ?, ?, ?)",
        [name, userName, email, role, created_at]
      );

      const userId = result.insertId;
      
      await DB.query(
        "INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)",
        [userId, password]
      );

      return { userId };
    } catch (err) {
      throw err;
    }
  },

  getUserByEmail: async (email) => {
    const query = `
      SELECT users.*, passwords.password_hash AS password
      FROM users
      JOIN passwords ON users.id = passwords.user_id
      WHERE users.email = ?
    `;

    try {
      const [results] = await DB.query(query, [email]);
      if (results.length === 0) return null;
      return results[0];
    } catch (err) {
      throw err;
    }
  }
};

export default usersModel;
