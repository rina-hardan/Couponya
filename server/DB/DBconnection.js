import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config({ path: './DB/.env' });


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

(async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to the database successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
  }
})();

export default db;