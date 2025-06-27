import DB from "../DB/DBconnection.js";

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
    SELECT coupons.*, business_owners.logo_url, business_owners.business_name,
    business_owners.description as bo_description, business_owners.website_url
    FROM coupons
    JOIN business_owners ON coupons.business_owner_id = business_owners.business_owner_id
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
      query += ` AND (title LIKE ? OR  business_owners.description  LIKE ? OR business_name LIKE ? OR address LIKE ? OR coupons.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
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
  getCouponsByBusinessOwnerId: async ({
    businessOwnerId,
    isActive,
    status,
    sortBy = 'expiry_date',
    sortOrder = 'ASC',
    limit = 20,
    offset = 0
  }) => {
    let sql = `
    SELECT 
      c.*,
      IFNULL(SUM(oi.quantity), 0) AS purchasedCount
    FROM coupons c
    LEFT JOIN order_items oi ON c.id = oi.coupon_id
    WHERE c.business_owner_id = ?
  `;
    const params = [businessOwnerId];

    if (typeof isActive === 'boolean') {
      sql += ` AND c.is_active = ?`;
      params.push(isActive);
    }

    if (status) {
      sql += ` AND c.status = ?`;
      params.push(status);
    }

    sql += `
    GROUP BY c.id
  `;

    const allowedSortFields = ['expiry_date', 'discounted_price', 'title', 'quantity'];
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'expiry_date';
    }
    sortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    sql += ` ORDER BY c.${sortBy} ${sortOrder}`;
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

  async getUnConfirmedCoupons() {
    const sql = `SELECT * FROM coupons WHERE status = 'pending'`;
    const [results] = await DB.query(sql);
    return results;
  },
  
  async getCouponsByAge(minAge, maxAge) {
    const [rows] = await DB.query(`
      SELECT c.*, business_owners.logo_url, business_owners.business_name,
    business_owners.description as bo_description, business_owners.website_url, COUNT(oi.id) AS popularity
      FROM coupons c
      JOIN business_owners ON c.business_owner_id = business_owners.business_owner_id
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

   getCouponsByRegion:async(regionId)=> {
  const [rows] = await DB.query(`
    SELECT c.*, bo.logo_url, bo.business_name,
           bo.description AS bo_description, bo.website_url,
           COUNT(oi.id) AS popularity
    FROM coupons c
    JOIN business_owners bo ON c.business_owner_id = bo.business_owner_id
    LEFT JOIN order_items oi ON oi.coupon_id = c.id
    LEFT JOIN orders o ON o.id = oi.order_id
    LEFT JOIN customers cu ON cu.customer_id = o.customer_id
    WHERE c.region_id = ?
      AND c.is_active = TRUE
      AND c.expiry_date >= CURDATE()
      AND c.quantity > 0
    GROUP BY c.id
    ORDER BY popularity DESC
    LIMIT 20
  `, [regionId]);
  return rows;
}
,

  updateCouponQuantities: async (items, connection) => {
    for (const item of items) {
      await connection.query(
        `UPDATE coupons SET quantity = quantity - ? WHERE id = ? AND quantity >= ?`,
        [item.quantity, item.couponId, item.quantity]
      );
    }
  }
  ,
   getAllActiveAndPopularity: async () => {
  const [rows] = await DB.query(`
    SELECT c.*, business_owners.logo_url, business_owners.business_name,
      business_owners.description as bo_description, business_owners.website_url,
      COUNT(oi.id) AS popularity
    FROM coupons c
    JOIN business_owners ON c.business_owner_id = business_owners.business_owner_id
    LEFT JOIN order_items oi ON oi.coupon_id = c.id
    WHERE c.is_active = TRUE
      AND c.expiry_date >= CURDATE()
      AND c.quantity > 0
    GROUP BY c.id
    ORDER BY popularity DESC
    LIMIT 20
  `);
  return rows;
}



};

export default couponsModel;
