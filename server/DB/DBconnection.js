import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
});

const DB = pool.promise();
(async () => {
  try {
    await DB.query('SELECT 1');
    console.log('✅ Connected to the database successfully.');
  
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const sql = await fs.readFile(path.join(__dirname, 'SQLFile.sql'), 'utf8');
    await DB.query(sql);
    console.log('✅ SQLFile.sql executed successfully.');

  } catch (error) {
    console.error(' Failed:', error.message);
  }
})();

export default DB;