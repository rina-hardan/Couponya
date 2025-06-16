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

  getAllActive: async () => {
    const sql = `SELECT * FROM coupons WHERE is_active = true`;
    const [results] = await DB.query(sql);
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

  getCouponsByBusinessOwnerId: async (businessOwnerId) => {
    const sql = `
      SELECT * FROM coupons
      WHERE business_owner_id = ?
    `;
    const [results] = await DB.query(sql, [businessOwnerId]);
    return results;
  }
};

export default couponsModel;
