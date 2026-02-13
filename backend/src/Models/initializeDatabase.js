const db = require("../config/db");

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");

    // Use a connection from the pool
    const connection = await db.getConnection();

    // Create `users` table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(10) DEFAULT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        active_status INT DEFAULT 0,
        role_id INT DEFAULT 0,
        permissions TEXT DEFAULT NULL,
        permited_fields TEXT DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create `categories` table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        details TEXT,
        active_status INT DEFAULT 0,
        icon VARCHAR(10) DEFAULT NULL,
        slug VARCHAR(10) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Tables created or already exist.");

    // Release connection back to pool
    connection.release();
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  }
}

module.exports = initializeDatabase;
