CREATE DATABASE IF NOT EXISTS couponya_db;
USE couponya_db;
-- טבלת אזורים
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  img_url VARCHAR(255) 
);

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userName VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin', 'customer', 'business_owner') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS passwords (
  user_id INT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- טבלת לקוחות
CREATE TABLE IF NOT EXISTS customers (
  customer_id INT PRIMARY KEY,
  region_id INT NOT NULL,
  birth_date DATE NOT NULL,
  points DECIMAL(10,2) DEFAULT 0.0,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
);

-- טבלת בעלי עסקים
CREATE TABLE IF NOT EXISTS business_owners (
  business_owner_id INT PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL ,
  description TEXT,
  website_url VARCHAR(255),
  logo_url VARCHAR(255),
  FOREIGN KEY (business_owner_id) REFERENCES users(id) ON DELETE CASCADE
);




-- טבלת קופונים
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_owner_id INT NOT NULL,
  category_id INT NOT NULL,
  region_id INT NOT NULL,
  title VARCHAR(100),
  description VARCHAR(255),
  original_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  address VARCHAR(100),
  code VARCHAR(100) NOT NULL UNIQUE,
  quantity INT CHECK (quantity > 0),
  expiry_date DATE,
  is_active BOOLEAN,
  status ENUM('pending','confirmed') DEFAULT 'pending',
  FOREIGN KEY (business_owner_id) REFERENCES business_owners(business_owner_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE  RESTRICT,
FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE RESTRICT
);

-- טבלת הזמנות
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  total_price DECIMAL(10,2),
  order_date DATE,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- טבלת פרטי הזמנה
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT ,
  coupon_id INT,
  quantity INT CHECK (quantity > 0),
  price_per_unit DECIMAL(10,2),
  total_price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  coupon_id INT NOT NULL,
  quantity INT NOT NULL,
  price_per_unit DECIMAL(10, 2),
  title VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);

-- INSERT INTO regions (name) VALUES
-- ('North'),
-- ('South'),
-- ('Center'),
-- ('Jerusalem and the surrounding area');
-- INSERT INTO users (userName, name, email, role)
-- VALUES ('sarit123', 'Sarit Levi', 'sarit@example.com', 'customer');
-- INSERT INTO passwords (user_id, password)
-- VALUES (LAST_INSERT_ID(), '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');


-- INSERT INTO users (userName, name, email, role)
-- VALUES ('meirco', 'Meir Cohen', 'meir@example.com', 'customer');
-- SET @userId2 = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@userId2, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO customers (customer_id, region_id, birth_date, points)
-- VALUES (@userId2, 1, '1990-02-10', 0.0);

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('danaA', 'Dana Azulay', 'dana@example.com', 'customer');
-- SET @userId3 = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@userId3, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO customers (customer_id, region_id, birth_date, points)
-- VALUES (@userId3, 1, '1998-08-27', 0.0);
 


-- INSERT INTO users (userName, name, email, role)
-- VALUES ('saquzers', 'SA Quzers', 'contact@saquzers.com', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'SA Quzers',
--   'Authentic Italian cuisine with a fresh modern twist.',
--   'https://saquzers.com',
--   '/uploads/ItalianKitchen.png'
-- );


-- INSERT INTO users (userName, name, email, role)
-- VALUES ('zolvgadol', 'Zol VeGadol', 'contact@zolvgadol.co.il', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'זול ובגדול',
--   'רשת קניות ישראלית עם מגוון רחב של מוצרים במחירים מוזלים.',
--   'https://zolvgadol.co.il',
--   '/uploads/zolVegadol.png'
-- );

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('luciana_rest', 'Luciana Italian House', 'info@luciana.co.il', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'Luciana',
--   'Authentic Italian restaurant by the sea, serving handcrafted pasta and wood-fired pizza.',
--   'https://luciana.co.il',
--   '/uploads/Luciana.png'
-- );

-- INSERT INTO categories (name, img_url) VALUES
-- ('Beauty', '/uploads/BEAUTY.png'),
-- ('Electronics', '/uploads/ELECTRONICS.png'),
-- ('Food and Drink', '/uploads/FOODANDDRINK.png'),
-- ('Home', '/uploads/HOME.png'),
-- ('Shopping', '/uploads/SHOPPING.png');

-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- )
-- VALUES (
--   4, 3, 3,
--   'Italian Dinner for Two - 80% Off',
--   'Enjoy a romantic Italian dinner for two at SA Quzers with fresh pasta and dessert included.',
--   300.00, 60.00,
--   '12 Dizengoff St, Tel Aviv',
--   'SAQ80DINNER',
--   25,
--   '2025-12-31',
--   true,
--   'confirmed'
-- );

-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- )
-- VALUES (
--   5, 5, 2,
--   '₪100 Off ₪500 Shopping Cart',
--   'Valid on any purchase of 500₪ or more at all Zol VeGadol branches.',
--   500.00, 400.00,
--   '3 Herzl St, Beersheba',
--   'ZVG100OFF',
--   100,
--   '2025-11-30',
--   true,
--   'confirmed'
-- );

-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- )
-- VALUES (
--   6, 3, 4,
--   'Free Pasta with Main Course',
--   'Buy a main course at Luciana and get a fresh handmade pasta for free!',
--   90.00, 45.00,
--   '5 Yaffo St, Jerusalem',
--   'LUCIANAPASTA',
--   30,
--   '2025-10-15',
--   true,
--   'confirmed'
-- );


-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- )
-- VALUES (
--   5, 4, 2,
--   'Home Essentials 50% Off',
--   'Half price on selected home products including cleaning and kitchen items.',
--   100.00, 50.00,
--   'Main Branch, Ashkelon',
--   'ZVGHOME50',
--   60,
--   '2025-09-30',
--   true,
--   'confirmed'
-- );

-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- )
-- VALUES (
--   4, 3, 3,
--   'Free Dessert on Your Birthday!',
--   'Celebrate your birthday at SA Quzers and get any dessert on the house.',
--   40.00, 0.00,
--   '12 Dizengoff St, Tel Aviv',
--   'SAQBIRTHDAY',
--   100,
--   '2025-12-31',
--   true,
--   'confirmed'
-- );

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('miri123', 'miri Levi', 'miri@example.com', 'customer');
-- SET @userId1 = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@userId1, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO customers (customer_id, region_id, birth_date, points)
-- VALUES (@userId1, 1, '1992-01-01', 0.0);
-- INSERT INTO orders (customer_id, total_price, order_date)
-- VALUES (@userId1, 120.00, '2025-06-26');

-- SET @order1_id = LAST_INSERT_ID();

-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
-- VALUES (@order1_id, 1, 2, 60.00, 120.00);


-- INSERT INTO orders (customer_id, total_price, order_date)
-- VALUES (2, 500.00, '2025-06-26');

-- SET @order2_id = LAST_INSERT_ID();

-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
-- VALUES 
-- (@order2_id, 2, 1, 400.00, 400.00),
-- (@order2_id, 4, 2, 50.00, 100.00);


-- INSERT INTO orders (customer_id, total_price, order_date)
-- VALUES (3, 45.00, '2025-06-26');

-- SET @order3_id = LAST_INSERT_ID();

-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
-- VALUES 
-- (@order3_id, 3, 1, 45.00, 45.00),
-- (@order3_id, 5, 1, 0.00, 0.00);


-- INSERT INTO cart_items (user_id, coupon_id, quantity, price_per_unit, title)
-- VALUES 
-- (1, 1, 1, 60.00, 'Italian Dinner for Two - 80% Off'),
-- (1, 5, 2, 0.00, 'Free Dessert on Your Birthday!');

-- INSERT INTO cart_items (user_id, coupon_id, quantity, price_per_unit, title)
-- VALUES 
-- (2, 2, 1, 400.00, '₪100 Off ₪500 Shopping Cart'),
-- (2, 4, 3, 50.00, 'Home Essentials 50% Off');
-- INSERT INTO users (userName, name, email, role)
-- VALUES ('admin1', 'Admin User', 'admin@example.com', 'admin');

-- SET @adminId = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@adminId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');
-- select * from categories;
-- select * from regions;
-- select * from users;
-- select * from business_owners;
-- select * from customers;
-- select * from coupons;
-- select * from orders;
-- select * FROM order_items;
-- select * FROM cart_items;

-- קופון מספר 1
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 2, 2,
--   'Special Offer #1', 'Description for coupon 1',
--   105.00, 63.00,
--   '1 Main St, City', 'CODE001', 20, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 2
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 3, 3,
--   'Special Offer #2', 'Description for coupon 2',
--   110.00, 66.00,
--   '2 Main St, City', 'CODE002', 30, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 3
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 4, 4,
--   'Special Offer #3', 'Description for coupon 3',
--   115.00, 69.00,
--   '3 Main St, City', 'CODE003', 40, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 4
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 5, 1,
--   'Special Offer #4', 'Description for coupon 4',
--   120.00, 72.00,
--   '4 Main St, City', 'CODE004', 50, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 5
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 1, 2,
--   'Special Offer #5', 'Description for coupon 5',
--   125.00, 75.00,
--   '5 Main St, City', 'CODE005', 10, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 6
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 2, 3,
--   'Special Offer #6', 'Description for coupon 6',
--   130.00, 78.00,
--   '6 Main St, City', 'CODE006', 20, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 7
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 3, 4,
--   'Special Offer #7', 'Description for coupon 7',
--   135.00, 81.00,
--   '7 Main St, City', 'CODE007', 30, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 8
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 4, 1,
--   'Special Offer #8', 'Description for coupon 8',
--   140.00, 84.00,
--   '8 Main St, City', 'CODE008', 40, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 9
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 5, 2,
--   'Special Offer #9', 'Description for coupon 9',
--   145.00, 87.00,
--   '9 Main St, City', 'CODE009', 50, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 10
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 1, 3,
--   'Special Offer #10', 'Description for coupon 10',
--   150.00, 90.00,
--   '10 Main St, City', 'CODE010', 10, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 11
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 2, 4,
--   'Special Offer #11', 'Description for coupon 11',
--   155.00, 93.00,
--   '11 Main St, City', 'CODE011', 20, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 12
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 3, 1,
--   'Special Offer #12', 'Description for coupon 12',
--   160.00, 96.00,
--   '12 Main St, City', 'CODE012', 30, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 13
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 4, 2,
--   'Special Offer #13', 'Description for coupon 13',
--   165.00, 99.00,
--   '13 Main St, City', 'CODE013', 40, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 14
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 5, 3,
--   'Special Offer #14', 'Description for coupon 14',
--   170.00, 102.00,
--   '14 Main St, City', 'CODE014', 50, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 15
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 1, 4,
--   'Special Offer #15', 'Description for coupon 15',
--   175.00, 105.00,
--   '15 Main St, City', 'CODE015', 10, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 16
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 2, 1,
--   'Special Offer #16', 'Description for coupon 16',
--   180.00, 108.00,
--   '16 Main St, City', 'CODE016', 20, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 17
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 3, 2,
--   'Special Offer #17', 'Description for coupon 17',
--   185.00, 111.00,
--   '17 Main St, City', 'CODE017', 30, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 18
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   4, 4, 3,
--   'Special Offer #18', 'Description for coupon 18',
--   190.00, 114.00,
--   '18 Main St, City', 'CODE018', 40, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 19
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   5, 5, 4,
--   'Special Offer #19', 'Description for coupon 19',
--   195.00, 117.00,
--   '19 Main St, City', 'CODE019', 50, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- -- קופון מספר 20
-- INSERT INTO coupons (
--   business_owner_id, category_id, region_id, title, description,
--   original_price, discounted_price, address, code, quantity, expiry_date,
--   is_active, status
-- ) VALUES (
--   6, 1, 1,
--   'Special Offer #20', 'Description for coupon 20',
--   200.00, 120.00,
--   '20 Main St, City', 'CODE020', 10, '2025-09-24',
--   TRUE, 'confirmed'
-- );

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 120.00, '2025-06-01');
-- SET @order1 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order1, 1, 2, 60.00, 120.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 180.00, '2025-06-03');
-- SET @order2 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order2, 2, 1, 180.00, 180.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 90.00, '2025-06-05');
-- SET @order3 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order3, 3, 2, 45.00, 90.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 100.00, '2025-06-07');
-- SET @order4 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order4, 4, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 0.00, '2025-06-09');
-- SET @order5 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order5, 5, 1, 0.00, 0.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 100.00, '2025-06-11');
-- SET @order6 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order6, 11, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 200.00, '2025-06-13');
-- SET @order7 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order7, 12, 2, 100.00, 200.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 150.00, '2025-06-15');
-- SET @order8 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order8, 13, 1, 150.00, 150.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 100.00, '2025-06-17');
-- SET @order9 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order9, 14, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (2, 150.00, '2025-06-19');
-- SET @order10 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order10, 15, 1, 150.00, 150.00);
-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 100.00, '2025-06-02');
-- SET @order11 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order11, 1, 1, 100.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 160.00, '2025-06-04');
-- SET @order12 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order12, 2, 1, 160.00, 160.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 45.00, '2025-06-06');
-- SET @order13 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order13, 3, 1, 45.00, 45.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 90.00, '2025-06-08');
-- SET @order14 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order14, 4, 2, 45.00, 90.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 0.00, '2025-06-10');
-- SET @order15 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order15, 5, 1, 0.00, 0.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 100.00, '2025-06-12');
-- SET @order16 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order16, 6, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 250.00, '2025-06-14');
-- SET @order17 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order17, 7, 2, 125.00, 250.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 130.00, '2025-06-16');
-- SET @order18 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order18, 8, 1, 130.00, 130.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 95.00, '2025-06-18');
-- SET @order19 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order19, 9, 1, 95.00, 95.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (3, 140.00, '2025-06-20');
-- SET @order20 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order20, 10, 1, 140.00, 140.00);
-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 120.00, '2025-06-01');
-- SET @order21 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order21, 1, 2, 60.00, 120.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 200.00, '2025-06-03');
-- SET @order22 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order22, 2, 1, 200.00, 200.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 90.00, '2025-06-05');
-- SET @order23 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order23, 3, 2, 45.00, 90.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 100.00, '2025-06-07');
-- SET @order24 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order24, 4, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 0.00, '2025-06-09');
-- SET @order25 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order25, 5, 1, 0.00, 0.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 100.00, '2025-06-11');
-- SET @order26 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order26, 6, 2, 50.00, 100.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 200.00, '2025-06-13');
-- SET @order27 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order27, 7, 2, 100.00, 200.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 130.00, '2025-06-15');
-- SET @order28 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order28, 8, 1, 130.00, 130.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 80.00, '2025-06-17');
-- SET @order29 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order29, 9, 1, 80.00, 80.00);

-- INSERT INTO orders (customer_id, total_price, order_date) VALUES (7, 160.00, '2025-06-19');
-- SET @order30 = LAST_INSERT_ID();
-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price) VALUES
-- (@order30, 10, 1, 160.00, 160.00);
