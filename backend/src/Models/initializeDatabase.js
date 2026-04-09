const db = require("../config/db");

async function initializeDatabase() {
  let connection;

  try {
    console.log("🚀 Initializing database...");

    connection = await db.getConnection();

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

        INDEX idx_user_id (user_id),
        INDEX idx_name (name),
        INDEX idx_active_status (active_status),
        INDEX idx_user_active (user_id, active_status),

        UNIQUE KEY unique_user_category (user_id, name),

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
    listing_type VARCHAR(20) NOT NULL,
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
    banner_image VARCHAR(255),
    latitude DECIMAL(10,8) DEFAULT NULL,
    longitude DECIMAL(11,8) DEFAULT NULL,
    status VARCHAR(50) DEFAULT 'available',
    slug VARCHAR(150) UNIQUE,
    
    -- JSON columns for amenities and features
    amenities JSON DEFAULT NULL,
    features JSON DEFAULT NULL,
    emenities_features JSON DEFAULT NULL,
    
    -- Instalment plan columns
    instalment_available TINYINT(1) DEFAULT 0,
    down_payment DECIMAL(12,2) DEFAULT NULL,
    monthly_installment DECIMAL(12,2) DEFAULT NULL,
    installment_years INT DEFAULT NULL,
    processing_fee DECIMAL(12,2) DEFAULT NULL,
    late_payment_fee DECIMAL(12,2) DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_category_id (category_id),
    INDEX idx_listing_type (listing_type),
    INDEX idx_price (price),
    INDEX idx_city (city),
    INDEX idx_status (status),
    INDEX idx_instalment_available (instalment_available),

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

        INDEX idx_property_id (property_id),

        CONSTRAINT fk_property_images_property
          FOREIGN KEY (property_id)
          REFERENCES properties(id)
          ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // ===============================
    // 5️⃣ Amenities Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS amenities (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(10),
        category VARCHAR(50),
        active_status TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // ===============================
    // 6️⃣ Features Table
    // ===============================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS features (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(10),
        description TEXT,
        active_status TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    await connection.query(`
  CREATE TABLE IF NOT EXISTS emenities_features (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10),
    description TEXT,
    type ENUM('amenity', 'feature') NOT NULL,
    active_status TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;
`);

    // ===============================
    // 7️⃣ Property Amenities (Pivot)
    // ===============================

    // ===============================
    // 8️⃣ Property Features (Pivot)
    // ===============================


    // ===============================
    // 🔥 Seed Amenities (if empty)
    // ===============================
    const [amenityRows] = await connection.query(`SELECT COUNT(*) as count FROM amenities`);
    if (amenityRows[0].count === 0) {
      console.log("🌱 Seeding amenities...");

      const amenities = [
        ["Swimming Pool", "🏊", "recreation", 1],
        ["Gym", "💪", "fitness", 1],
        ["Parking", "🅿️", "parking", 1],
        ["Security", "🔒", "safety", 1],
        ["Elevator", "🛗", "convenience", 1],
        ["Central AC", "❄️", "climate", 1],
        ["Heating", "🔥", "climate", 1],
        ["Laundry", "🧺", "convenience", 1],
        ["Balcony", "🏠", "outdoor", 1],
        ["Garden", "🌺", "outdoor", 1],
        ["Children Play Area", "🎠", "family", 1],
        ["Pets Allowed", "🐕", "pets", 1],
        ["Furnished", "🛋️", "furnishing", 1],
        ["Internet", "🌐", "technology", 1],
        ["Cable TV", "📺", "entertainment", 1]
      ];

      for (const item of amenities) {
        await connection.query(
          `INSERT INTO amenities (name, icon, category, active_status) VALUES (?, ?, ?, ?)`,
          item
        );
      }
    }

    // ===============================
    // 🔥 Seed Features (if empty)
    // ===============================
    const [featureRows] = await connection.query(`SELECT COUNT(*) as count FROM features`);
    if (featureRows[0].count === 0) {
      console.log("🌱 Seeding features...");

      const features = [
        ["Smart Home", "🏠", "Automated home systems", 1],
        ["Solar Panels", "☀️", "Energy efficient", 1],
        ["Rainwater Harvesting", "💧", "Water conservation", 1],
        ["Waste Disposal", "🗑️", "Modern waste management", 1],
        ["Wheelchair Access", "♿", "Accessibility feature", 1],
        ["Smart Locks", "🔐", "Digital security", 1],
        ["Video Doorbell", "📹", "Security feature", 1],
        ["EV Charging", "🔋", "Electric vehicle ready", 1],
        ["Sound Proof", "🔇", "Noise reduction", 1],
        ["Wine Cellar", "🍷", "Premium storage", 1],
        ["Home Theater", "🎬", "Entertainment system", 1],
        ["Sauna", "🧖", "Wellness feature", 1],
        ["Jacuzzi", "🛁", "Luxury bathing", 1],
        ["Smart Irrigation", "💦", "Automated gardening", 1],
        ["Backup Generator", "⚡", "Power backup", 1]
      ];

      for (const item of features) {
        await connection.query(
          `INSERT INTO features (name, icon, description, active_status) VALUES (?, ?, ?,?)`,
          item
        );
      }
    }



    const [emenitiesFeatureRows] = await connection.query(`SELECT COUNT(*) as count FROM emenities_features`);
    if (emenitiesFeatureRows[0].count === 0) {
      console.log("🌱 Seeding features...");

      const emenitiesFeature = [
        ["Swimming Pool", "🏊", "recreation", 1, 'amenity'],
        ["Gym", "💪", "fitness", 1, 'amenity'],
        ["Parking", "🅿️", "parking", 1, 'amenity'],
        ["Security", "🔒", "safety", 1, 'amenity'],
        ["Elevator", "🛗", "convenience", 1, 'amenity'],
        ["Central AC", "❄️", "climate", 1, 'amenity'],
        ["Heating", "🔥", "climate", 1, 'amenity'],
        ["Laundry", "🧺", "convenience", 1, 'amenity'],
        ["Balcony", "🏠", "outdoor", 1, 'amenity'],
        ["Garden", "🌺", "outdoor", 1, 'amenity'],
        ["Children Play Area", "🎠", "family", 1, 'amenity'],
        ["Pets Allowed", "🐕", "pets", 1, 'amenity'],
        ["Furnished", "🛋️", "furnishing", 1, 'amenity'],
        ["Internet", "🌐", "technology", 1, 'amenity'],
        ["Cable TV", "📺", "entertainment", 1, 'amenity'],

        ["Smart Home", "🏠", "Automated home systems", 1, 'feature'],
        ["Solar Panels", "☀️", "Energy efficient", 1, 'feature'],
        ["Rainwater Harvesting", "💧", "Water conservation", 1, 'feature'],
        ["Waste Disposal", "🗑️", "Modern waste management", 1, 'feature'],
        ["Wheelchair Access", "♿", "Accessibility feature", 1, 'feature'],
        ["Smart Locks", "🔐", "Digital security", 1, 'feature'],
        ["Video Doorbell", "📹", "Security feature", 1, 'feature'],
        ["EV Charging", "🔋", "Electric vehicle ready", 1, 'feature'],
        ["Sound Proof", "🔇", "Noise reduction", 1, 'feature'],
        ["Wine Cellar", "🍷", "Premium storage", 1, 'feature'],
        ["Home Theater", "🎬", "Entertainment system", 1, 'feature'],
        ["Sauna", "🧖", "Wellness feature", 1, 'feature'],
        ["Jacuzzi", "🛁", "Luxury bathing", 1, 'feature'],
        ["Smart Irrigation", "💦", "Automated gardening", 1, 'feature'],
        ["Backup Generator", "⚡", "Power backup", 1, 'feature']
      ];

      for (const item of emenitiesFeature) {
        await connection.query(
          `INSERT INTO emenities_features (name, icon, description, active_status, type) VALUES (?, ?, ?, ?, ?)`,
          item
        );
      }
    }

    console.log("✅ All tables created & seeded successfully.");

  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = initializeDatabase;