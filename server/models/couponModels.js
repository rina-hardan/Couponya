import DB from "../DB/DBconnection.js"

const couponsModel = {
  create: (data) => {
    return new Promise((resolve, reject) => {
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
        data.is_active || true,
        data.status || 'pending'
      ];
      DB.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...data });
      });
    });
  },

  getAllActive: () => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM coupons WHERE is_active = true AND status = 'confirmed' AND quantity > 0 AND expiry_date >= CURDATE()`;
      DB.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM coupons WHERE id = ?`;
      DB.query(sql, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE coupons SET
          category_id = ?,
          region_id = ?,
          title = ?,
          description = ?,
          original_price = ?,
          discounted_price = ?,
          address = ?,
          code = ?,
          quantity = ?,
          expiry_date = ?,
          is_active = ?,
          status = ?
        WHERE id = ?
      `;
      const params = [
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
        data.is_active,
        data.status,
        id
      ];
      DB.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM coupons WHERE id = ?`;
      DB.query(sql, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  },

  getPurchasesCount: (couponId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT SUM(oi.quantity) AS purchasedCount
        FROM order_items oi
        WHERE oi.coupon_id = ?
      `;
      DB.query(sql, [couponId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].purchasedCount || 0);
      });
    });
  },
  getCouponsByBusinessOwnerId: (businessOwnerId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM coupons
      WHERE business_owner_id = ?
    `;
    DB.query(sql, [businessOwnerId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

};

export default couponsModel;
