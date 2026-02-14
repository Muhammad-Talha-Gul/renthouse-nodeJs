const db = require("../config/db");

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");

    // Use a connection from the pool
    const connection = await db.getConnection();

    // ===============================
    // 1️⃣ Users Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(15) DEFAULT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        active_status TINYINT(1) DEFAULT 0,
        role_id INT UNSIGNED DEFAULT 0,
        permissions TEXT DEFAULT NULL,
        permited_fields TEXT DEFAULT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Indexes
        INDEX idx_email (email),
        INDEX idx_role_id (role_id),
        INDEX idx_active_status (active_status),
        INDEX idx_phone (phone_number)
      ) ENGINE=InnoDB;
    `);

    // ===============================
    // 2️⃣ Categories Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        details TEXT,
        active_status TINYINT(1) DEFAULT 0,
        icon VARCHAR(100) DEFAULT NULL,
        slug VARCHAR(150) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Indexes
        INDEX idx_user_id (user_id),
        INDEX idx_name (name),
        INDEX idx_active_status (active_status),
        INDEX idx_user_active (user_id, active_status),

        -- Unique constraint: user cannot have duplicate category names
        UNIQUE KEY unique_user_category (user_id, name),

        -- Foreign key
        CONSTRAINT fk_categories_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ===============================
    // 3️⃣ Properties Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        category_id INT UNSIGNED NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        listing_type VARCHAR(20) NOT NULL, -- rent / sale
        price DECIMAL(12,2) NOT NULL,
        bedrooms INT UNSIGNED DEFAULT NULL,
        bathrooms INT UNSIGNED DEFAULT NULL,
        area DECIMAL(10,2) DEFAULT NULL,
        area_unit VARCHAR(20) DEFAULT 'sqft',
        furnished VARCHAR(50) DEFAULT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        latitude DECIMAL(10,8) DEFAULT NULL,
        longitude DECIMAL(11,8) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'available',
        slug VARCHAR(150) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        -- Indexes
        INDEX idx_user_id (user_id),
        INDEX idx_category_id (category_id),
        INDEX idx_listing_type (listing_type),
        INDEX idx_price (price),
        INDEX idx_city (city),
        INDEX idx_status (status),

        -- Foreign keys
        CONSTRAINT fk_properties_user
          FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        CONSTRAINT fk_properties_category
          FOREIGN KEY (category_id)
          REFERENCES categories(id)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB;
    `);

    // ===============================
    // 4️⃣ Property Images Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        property_id INT UNSIGNED NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        is_primary TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        -- Index
        INDEX idx_property_id (property_id),

        -- Foreign key
        CONSTRAINT fk_property_images_property
          FOREIGN KEY (property_id)
          REFERENCES properties(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log("✅ All tables created or already exist.");

    // Release connection back to pool
    connection.release();
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  }
}

module.exports = initializeDatabase;
