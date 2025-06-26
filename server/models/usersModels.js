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
        "INSERT INTO passwords (user_id, password) VALUES (?, ?)",
        [userId, password]
      );

      return userId;
    } catch (err) {
      throw err;
    }
  },

  getUserByEmail: async (email) => {
    const query = `
    SELECT users.*, passwords.password AS password
    FROM users
    JOIN passwords ON users.id = passwords.user_id
    WHERE users.email = ?
  `;

    try {
      const [results] = await DB.query(query, [email]);
      if (results.length === 0) return null;

      const user = results[0];

      let additionalDetails = {};
      if (user.role === 'customer') {
        const [customerResults] = await DB.query(
          'SELECT * FROM customers WHERE customer_id = ?',
          [user.id]
        );
        additionalDetails = customerResults[0] || {};
      } else if (user.role === 'business_owner') {
        const [businessResults] = await DB.query(
          'SELECT * FROM business_owners WHERE business_owner_id = ?',
          [user.id]
        );
        additionalDetails = businessResults[0] || {};
      }

      delete additionalDetails.customer_id;
      delete additionalDetails.business_owner_id;

      Object.assign(user, additionalDetails);

      return user;
    } catch (err) {
      throw err;
    }
  }
  ,
  registerBusinessOwner: async ({ userId, business_name, description, website_url, logo_url }) => {
  try {
    const [result] = await DB.query(
      "INSERT INTO business_owners (business_owner_id, business_name, description, website_url, logo_url) VALUES (?, ?, ?, ?, ?)",
      [userId, business_name, description, website_url, logo_url]
    );
    return { success: true };
  } catch (err) {
    console.error("Error in registerBusinessOwner:", err);
    return { success: false, message: err };
  }
},
  registerCustomer: async ({ userId, birth_date,region_id }) => {
  try {
    const [result] = await DB.query(
      "INSERT INTO customers (customer_id, birth_date,region_id) VALUES (?, ?,?)",
      [userId, birth_date, region_id]
    );
    return { success: true, points: result.points};
  } catch (err) {
    console.error("Error in registerCustomer:", err);
    return { success: false, message: err };
  }
},
updateUser: async (userId, data, userType) => {
  const conn = await DB.getConnection();

    try {
      await conn.beginTransaction();

      const userFields = ['name'];
      const setUser = [];
      const userValues = [];

      for (const key of userFields) {
        if (data[key] !== undefined) {
          setUser.push(`${key} = ?`);
          userValues.push(data[key]);
        }
      }

      if (setUser.length > 0) {
        const userSql = `
        UPDATE users SET ${setUser.join(', ')}
        WHERE id = ?
      `;
        userValues.push(userId);
        await conn.query(userSql, userValues);
      }

      let tableName;
      let idColumn;
      let profileFields = [];

    if (userType === 'customer') {
      tableName = 'customers';
      idColumn = 'customer_id';
      profileFields = ['region_id'];
    } else if (userType === 'business_owner') {
      tableName = 'business_owners';
      idColumn = 'business_owner_id';
      profileFields = ['business_name', 'description', 'website_url', 'logo_url'];
    } else {
      throw new Error("Invalid user type");
    }

      const setProfile = [];
      const profileValues = [];

      for (const key of profileFields) {
        if (data[key] !== undefined) {
          setProfile.push(`${key} = ?`);
          profileValues.push(data[key]);
        }
      }

      if (setProfile.length > 0) {
        const profileSql = `
        UPDATE ${tableName}
        SET ${setProfile.join(', ')}
        WHERE ${idColumn} = ?
      `;
        profileValues.push(userId);
        await conn.query(profileSql, profileValues);
      }

      await conn.commit();
      return { success: true };

    } catch (err) {
      await conn.rollback();
      console.error("Error in updateUser:", err);
      return { success: false, message: err.message };
    } finally {
      conn.release();
    }
  },

updateCustomerPoints: async (userId, points) => {
  try {
    const sql = `
      UPDATE customers
      SET points = ?
      WHERE customer_id = ?
    `;
    const [result] = await DB.query(sql, [points, userId]);

    return { success: result.affectedRows > 0 };
  } catch (err) {
    console.error("Error in updateUserPoints:", err);
    return { success: false, message: err };
  }
}


};

export default usersModel;
