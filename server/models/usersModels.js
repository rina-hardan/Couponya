import DB from "../DB/DBconnection.js";

const usersModel = {
registerCustomerUser: async (data) => {
  const {name,userName,email,password,birth_date,region_id,created_at} = data;

  const query = `
    INSERT INTO users (name, userName, email, role, created_at)
    VALUES (?, ?, ?, 'customer', ?);
    INSERT INTO passwords (user_id, password)
    VALUES (LAST_INSERT_ID(), ?);
    INSERT INTO customers (customer_id, birth_date, region_id)
    VALUES (LAST_INSERT_ID(), ?, ?);
  `;

  const params = [name,userName,email,created_at,password,birth_date,region_id];
  const [result] = await DB.query(query, params);
  const userId = result[0]?.insertId || result.insertId;

  return { userId, userName, email, role: 'customer', name, birth_date, region_id};
}
,
registerBusinessOwnerUser: async (data) => {
  const { name, userName, email, password, business_name, description, website_url, logo_url, created_at } = data;

  const query = `
    INSERT INTO users (name, userName, email, role, created_at)
    VALUES (?, ?, ?, 'business_owner', ?);
    INSERT INTO passwords (user_id, password)
    VALUES (LAST_INSERT_ID(), ?);
    INSERT INTO business_owners (business_owner_id, business_name, description, website_url, logo_url)
    VALUES (LAST_INSERT_ID(), ?, ?, ?, ?);
  `;

  const params = [name,userName,email,created_at,password,business_name,description,website_url,logo_url ];

  const [result] = await DB.query(query, params);
  const userId = result[0]?.insertId || result.insertId;

  return {userId,userName,email,role: 'business_owner',name,business_name,description,website_url,logo_url};
}
,

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
updateUser: async (userId, data, userType) => {
  const conn = await DB.getConnection();
  try {
    await conn.beginTransaction();

    // עדכון בטבלת users
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

    // עדכון בטבלה הרלוונטית לפי תפקיד
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

    // שליפה מחדש של המשתמש עם JOIN לפי התפקיד
    let fullUser;
    if (userType === 'customer') {
      const [rows] = await conn.query(`
        SELECT u.id, u.userName, u.name, u.email, u.role, u.created_at,
               c.region_id, c.birth_date, c.points
        FROM users u
        JOIN customers c ON u.id = c.customer_id
        WHERE u.id = ?
      `, [userId]);
      fullUser = rows[0];
    } else if (userType === 'business_owner') {
      const [rows] = await conn.query(`
        SELECT u.id, u.userName, u.name, u.email, u.role, u.created_at,
               b.business_name, b.description, b.website_url, b.logo_url
        FROM users u
        JOIN business_owners b ON u.id = b.business_owner_id
        WHERE u.id = ?
      `, [userId]);
      fullUser = rows[0];
    }

    return { success: true, user: fullUser };

  } catch (err) {
    await conn.rollback();
    console.error("Error in updateUser:", err);
    return { success: false, message: err.message };
  } finally {
    conn.release();
  }
}
,

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
