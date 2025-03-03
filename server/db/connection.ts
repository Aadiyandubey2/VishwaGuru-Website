import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'vishwaguru_db'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database tables
export const createConnection = async () => {
  try {
    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create numerology_readings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS numerology_readings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        birthdate DATE NOT NULL,
        destiny_number INT NOT NULL,
        soul_urge_number INT NOT NULL,
        personality_number INT NOT NULL,
        life_path_number INT NOT NULL,
        birthday_number INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database tables initialized');
    return pool;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Export the pool for use in other modules
export default pool;