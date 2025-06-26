CREATE DATABASE IF NOT EXISTS couponya_db;
USE couponya_db;

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
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL
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

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  img_url VARCHAR(255) 
);

-- טבלת אזורים
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
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
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE  RESTRICT
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

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('sarit123', 'Sarit Levi', 'sarit@example.com', 'customer');
-- INSERT INTO passwords (user_id, password)
-- VALUES (LAST_INSERT_ID(), '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');
-- INSERT INTO regions (name) VALUES
-- ('North'),
-- ('South'),
-- ('Center'),
-- ('Jerusalem and the surrounding area');

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('meirco', 'Meir Cohen', 'meir@example.com', 'customer');
-- SET @userId2 = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@userId2, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO customers (customer_id, region_id, birth_date, points)
-- VALUES (@userId2, 1, '1990-02-10', 0.0);

-- לקוח 3: Dana Azulay
-- INSERT INTO users (userName, name, email, role)
-- VALUES ('danaA', 'Dana Azulay', 'dana@example.com', 'customer');
-- SET @userId3 = LAST_INSERT_ID();

-- INSERT INTO passwords (user_id, password)
-- VALUES (@userId3, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- INSERT INTO customers (customer_id, region_id, birth_date, points)
-- VALUES (@userId3, 1, '1998-08-27', 0.0);
 
 -- INSERT INTO categories (name) VALUES
-- ('Culture and Leisure'),
-- ('Shopping'),
-- ('Restaurants and Food'),
-- ('Vacations and Leisure');

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('saquzers', 'SA Quzers', 'contact@saquzers.com', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- -- הכנסת סיסמה מוצפנת (אותה כמו הקודמים)
-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- -- הכנסת פרטי בעל העסק כולל הלוגו
-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'SA Quzers',
--   'Authentic Italian cuisine with a fresh modern twist.',
--   'https://saquzers.com',
--   'server/uploads/ItalianKitchen.png'
-- );


-- INSERT INTO users (userName, name, email, role)
-- VALUES ('zolvgadol', 'Zol VeGadol', 'contact@zolvgadol.co.il', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- -- הכנסת סיסמה מוצפנת
-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- -- הכנסת פרטי בעל עסק כולל הלוגו
-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'זול ובגדול',
--   'רשת קניות ישראלית עם מגוון רחב של מוצרים במחירים מוזלים.',
--   'https://zolvgadol.co.il',
--   'server/uploads/ZolVgadol.png'
-- );

-- INSERT INTO users (userName, name, email, role)
-- VALUES ('luciana_rest', 'Luciana Italian House', 'info@luciana.co.il', 'business_owner');
-- SET @ownerId = LAST_INSERT_ID();

-- -- הכנסת סיסמה מוצפנת
-- INSERT INTO passwords (user_id, password)
-- VALUES (@ownerId, '$2b$10$TEAb09I19K9mzbv1nyQ7yebbo0u47z8O42uAp4PVjxMOLrPJiSEDi');

-- -- הוספת בעל עסק כולל לוגו
-- INSERT INTO business_owners (
--   business_owner_id, business_name, description, website_url, logo_url
-- )
-- VALUES (
--   @ownerId,
--   'Luciana',
--   'Authentic Italian restaurant by the sea, serving handcrafted pasta and wood-fired pizza.',
--   'https://luciana.co.il',
--   'server/uploads/Luciana.png'
-- );

-- INSERT INTO categories (name, img_url) VALUES
-- ('Beauty', 'server/uploads/BEAUTY.png'),
-- ('Electronics', 'server/uploads/ELECTRONICS.png'),
-- ('Food and Drink', 'server/uploads/FOODANDDRINK.png'),
-- ('Home', 'server/uploads/HOME.png'),
-- ('Shopping', 'server/uploads/SHOPPING.png');

-- קופון 1: SA Quzers - הנחה על ארוחה איטלקית זוגית
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

-- קופון 2: זול ובגדול - הנחה על קניה חודשית
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

-- קופון 3: Luciana - פסטה מתנה עם מנה עיקרית
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


-- קופון 4: זול ובגדול - מוצרי בית ב-50%
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

-- קופון 5: SA Quzers - קינוח מתנה ביום הולדת
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

-- הזמנה 1: סרית (customer_id = 1), קופון SAQ80DINNER × 2 יחידות
-- INSERT INTO orders (customer_id, total_price, order_date)
-- VALUES (1, 120.00, '2025-06-26');

-- SET @order1_id = LAST_INSERT_ID();

-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
-- VALUES (@order1_id, 1, 2, 60.00, 120.00);


-- הזמנה 2: מאיר (customer_id = 2), קופון ZVG100OFF × 1, וקופון ZVGHOME50 × 2
-- INSERT INTO orders (customer_id, total_price, order_date)
-- VALUES (2, 500.00, '2025-06-26');

-- SET @order2_id = LAST_INSERT_ID();

-- INSERT INTO order_items (order_id, coupon_id, quantity, price_per_unit, total_price)
-- VALUES 
-- (@order2_id, 2, 1, 400.00, 400.00),
-- (@order2_id, 4, 2, 50.00, 100.00);


-- הזמנה 3: דנה (customer_id = 3), קופון LUCIANAPASTA × 1, וקופון SAQBIRTHDAY × 1
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

-- עגלה של מאיר (user_id = 2)
-- INSERT INTO cart_items (user_id, coupon_id, quantity, price_per_unit, title)
-- VALUES 
-- (2, 2, 1, 400.00, '₪100 Off ₪500 Shopping Cart'),
-- (2, 4, 3, 50.00, 'Home Essentials 50% Off');
select * from categories;
select * from regions;
select * from users;
select * from business_owners;
select * from customers;
select * from coupons;
select * from orders;
select * FROM order_items;
select * FROM cart_items;

