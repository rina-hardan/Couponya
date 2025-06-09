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
  birth_date DATE,
  points INT DEFAULT 0,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- טבלת בעלי עסקים
CREATE TABLE IF NOT EXISTS business_owners (
  business_owner_id INT PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(255),
  logo_url VARCHAR(255),
  FOREIGN KEY (business_owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- טבלת קטגוריות
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- טבלת אזורים
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- טבלת קופונים
CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_owner_id INT NOT NULL,
  category_id INT,
  region_id INT,
  title VARCHAR(100),
  description VARCHAR(255),
  original_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  address VARCHAR(100),
  code VARCHAR(100) NOT NULL,
  quantity INT,
  expiry_date DATE,
  is_active BOOLEAN,
  status ENUM('pending','confirmed') DEFAULT 'pending',
  FOREIGN KEY (business_owner_id) REFERENCES business_owners(business_owner_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL
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
  order_id INT,
  coupon_id INT,
  quantity INT,
  price_per_unit DECIMAL(10,2),
  total_price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE
);
INSERT INTO regions (name) VALUES
('North'),
('South'),
('Center'),
('Jerusalem'),
('Haifa'),
('Sharon');

INSERT INTO categories (name) VALUES
('Culture and Leisure'),
('Shopping'),
('Restaurants and Food'),
('Vacations and Leisure');

select * from categories;
select * from regions;
