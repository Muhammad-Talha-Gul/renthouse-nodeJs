const db = require("../src/config/db");
const bcrypt = require("bcryptjs");

async function seedDatabase() {
  const connection = await db.getConnection();

  try {
    console.log("🌱 Seeding database...");

    // ===============================
    // 1️⃣ Seed Users
    // ===============================

    const hashedPassword = await bcrypt.hash("123456", 10);

    const [userResult] = await connection.query(
      `
      INSERT INTO users 
      (name, email, phone_number, role_id, active_status, password, permissions) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        "Admin User",
        "admin@example.com",
        "03001234567",
        1,
        1,
        hashedPassword,
        JSON.stringify({
          users: ["read", "create", "update", "delete"],
          properties: ["read", "create", "update", "delete"],
        }),
      ]
    );

    const userId = userResult.insertId;

    // ===============================
    // 2️⃣ Seed Categories
    // ===============================

    const [categoryResult] = await connection.query(
      `
      INSERT INTO categories 
      (user_id, name, details, active_status, slug) 
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        userId,
        "Apartments",
        "All apartment listings",
        1,
        "apartments",
      ]
    );

    const categoryId = categoryResult.insertId;

    // ===============================
    // 3️⃣ Seed Properties
    // ===============================

    const [propertyResult] = await connection.query(
      `
      INSERT INTO properties
      (user_id, category_id, title, description, listing_type, price, bedrooms, bathrooms, area, city, state, country, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        categoryId,
        "Luxury Apartment in City Center",
        "Beautiful fully furnished apartment.",
        "rent",
        120000,
        3,
        2,
        1200,
        "Lahore",
        "Punjab",
        "Pakistan",
        "luxury-apartment-city-center",
      ]
    );

    const propertyId = propertyResult.insertId;

    // ===============================
    // 4️⃣ Seed Property Images
    // ===============================

    await connection.query(
      `
      INSERT INTO property_images
      (property_id, image_url, is_primary)
      VALUES (?, ?, ?)
    `,
      [propertyId, "https://example.com/image1.jpg", 1]
    );

    await connection.query(
      `
      INSERT INTO property_images
      (property_id, image_url, is_primary)
      VALUES (?, ?, ?)
    `,
      [propertyId, "https://example.com/image2.jpg", 0]
    );

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    connection.release();
  }
}

seedDatabase();
