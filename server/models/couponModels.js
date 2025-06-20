import DB from "../DB/DBconnection.js";
const weights = {
  byAge: 0.5,
  byRegion: 0.3,
  general: 0.2,
};
const couponsModel = {
  create: async (data) => {
    const sql = `
      INSERT INTO coupons
      (business_owner_id, category_id, region_id, title, description, original_price, discounted_price,
       address, code, quantity, expiry_date, is_active, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.business_owner_id,
      data.category_id || null,
      data.region_id || null,
      data.title,
      data.description,
      data.original_price,
      data.discounted_price,
      data.address,
      data.code,
      data.quantity,
      data.expiry_date,
      data.is_active ?? true,
      data.status || 'pending'
    ];
    const [result] = await DB.query(sql, params);
    return { id: result.insertId, ...data };
  },

  // getAllActive: async () => {
  //   const sql = `SELECT * FROM coupons WHERE is_active = true`;
  //   const [results] = await DB.query(sql);
  //   return results;
  // },
  getAllActive: async ({ categoryId, regionId, minPrice, maxPrice, search, sort, limit, offset }) => {
    let query = `
    SELECT * FROM coupons
    WHERE is_active = true 
      AND status = 'confirmed'
      AND expiry_date >= CURDATE()
      AND quantity > 0
  `;
    const params = [];

    if (categoryId) {
      query += ` AND category_id = ?`;
      params.push(categoryId);
    }

    if (regionId) {
      query += ` AND region_id = ?`;
      params.push(regionId);
    }

    if (minPrice) {
      query += ` AND discounted_price >= ?`;
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND discounted_price <= ?`;
      params.push(maxPrice);
    }

    if (search) {
      query += ` AND (title LIKE ? OR description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    const [sortField = "expiry_date", sortDirection = "asc"] = (sort || "expiry_date_asc").split("_");
    const validFields = ["discounted_price", "original_price", "expiry_date", "title"];
    const validDirections = ["asc", "desc"];

    if (validFields.includes(sortField) && validDirections.includes(sortDirection)) {
      query += ` ORDER BY ${sortField} ${sortDirection.toUpperCase()}`;
    } else {
      query += ` ORDER BY expiry_date ASC`;
    }
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [results] = await DB.query(query, params);
    return results;
  },

  getById: async (id) => {
    const sql = `SELECT * FROM coupons WHERE id = ?`;
    const [results] = await DB.query(sql, [id]);
    return results[0];
  },
  getCouponsByIds: async (ids) => {
    if (!ids || ids.length === 0) return [];

    const placeholders = ids.map(() => '?').join(',');
    const sql = `SELECT * FROM coupons WHERE id IN (${placeholders})`;
    const [results] = await DB.query(sql, ids);
    return results;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const sql = `
    UPDATE coupons SET ${fields.join(', ')}
    WHERE id = ?
  `;
    values.push(id);

    const [result] = await DB.query(sql, values);
    return result.affectedRows > 0;
  }
  ,
  delete: async (id) => {
    const sql = `DELETE FROM coupons WHERE id = ?`;
    const [result] = await DB.query(sql, [id]);
    return result.affectedRows > 0;
  },

  getPurchasesCount: async (couponId) => {
    const sql = `
      SELECT SUM(oi.quantity) AS purchasedCount
      FROM order_items oi
      WHERE oi.coupon_id = ?
    `;
    const [results] = await DB.query(sql, [couponId]);
    return results[0].purchasedCount || 0;
  },

  // getCouponsByBusinessOwnerId: async (businessOwnerId) => {
  //   const sql = `
  //     SELECT * FROM coupons
  //     WHERE business_owner_id = ?
  //   `;
  //   const [results] = await DB.query(sql, [businessOwnerId]);
  //   return results;
  // },
  getCouponsByBusinessOwnerId: async ({ businessOwnerId, isActive, status, sortBy = 'expiry_date', sortOrder = 'ASC', limit = 20, offset = 0 }) => {
  let sql = `SELECT * FROM coupons WHERE business_owner_id = ?`;
  const params = [businessOwnerId];

  if (typeof isActive === 'boolean') {
    sql += ` AND is_active = ?`;
    params.push(isActive);
  }

  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }

  const allowedSortFields = ['expiry_date', 'discounted_price', 'title', 'quantity'];
  if (!allowedSortFields.includes(sortBy)) {
    sortBy = 'expiry_date';
  }
  sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortBy} ${sortOrder}`;

  sql += ` LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [results] = await DB.query(sql, params);
  return results;
}
,
  confirmCoupon: async (couponId) => {
    const sql = `
      UPDATE coupons
      SET status = 'confirmed'
      WHERE id = ?
    `;
    const [result] = await DB.query(sql, [couponId]);
    return result.affectedRows > 0;
  },

  async getCouponsByAge(minAge, maxAge) {
    const [rows] = await DB.query(`
      SELECT c.*, COUNT(oi.id) AS popularity
      FROM coupons c
      JOIN order_items oi ON oi.coupon_id = c.id
      JOIN orders o ON o.id = oi.order_id
      JOIN customers cu ON cu.customer_id = o.customer_id
      WHERE TIMESTAMPDIFF(YEAR, cu.birth_date, CURDATE()) BETWEEN ? AND ?
        AND c.is_active = TRUE
        AND c.expiry_date >= CURDATE()
        AND c.quantity > 0
      GROUP BY c.id
      ORDER BY popularity DESC
      LIMIT 20
    `, [minAge, maxAge]);
    return rows;
  },

  async getCouponsByRegion(address) {
    const [rows] = await DB.query(`
      SELECT c.*, COUNT(oi.id) AS popularity
      FROM coupons c
      JOIN order_items oi ON oi.coupon_id = c.id
      JOIN orders o ON o.id = oi.order_id
      JOIN customers cu ON cu.customer_id = o.customer_id
      WHERE cu.address = ?
        AND c.is_active = TRUE
        AND c.expiry_date >= CURDATE()
        AND c.quantity > 0
      GROUP BY c.id
      ORDER BY popularity DESC
      LIMIT 10
    `, [address]);
    return rows;
  },




};

export default couponsModel;
