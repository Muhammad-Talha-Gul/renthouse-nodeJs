const db = require("../src/config/db");

async function seedDatabase() {
  const connection = await db.getConnection();

  try {
    console.log("🌱 Seeding Amenities & Features...");

    // ===============================
    // 🏊 Amenities Seeder
    // ===============================
    const amenities = [
      ["Swimming Pool", "🏊", "recreation"],
      ["Gym", "💪", "fitness"],
      ["Parking", "🅿️", "parking"],
      ["Security", "🔒", "safety"],
      ["Elevator", "🛗", "convenience"],
      ["Central AC", "❄️", "climate"],
      ["Heating", "🔥", "climate"],
      ["Laundry", "🧺", "convenience"],
      ["Balcony", "🏠", "outdoor"],
      ["Garden", "🌺", "outdoor"],
      ["Children Play Area", "🎠", "family"],
      ["Pets Allowed", "🐕", "pets"],
      ["Furnished", "🛋️", "furnishing"],
      ["Internet", "🌐", "technology"],
      ["Cable TV", "📺", "entertainment"]
    ];

    for (const item of amenities) {
      await connection.query(
        `INSERT IGNORE INTO amenities (name, icon, category) VALUES (?, ?, ?)`,
        item
      );
    }

    console.log("✅ Amenities seeded");

    // ===============================
    // ⚡ Features Seeder
    // ===============================
    const features = [
      ["Smart Home", "🏠", "Automated home systems"],
      ["Solar Panels", "☀️", "Energy efficient"],
      ["Rainwater Harvesting", "💧", "Water conservation"],
      ["Waste Disposal", "🗑️", "Modern waste management"],
      ["Wheelchair Access", "♿", "Accessibility feature"],
      ["Smart Locks", "🔐", "Digital security"],
      ["Video Doorbell", "📹", "Security feature"],
      ["EV Charging", "🔋", "Electric vehicle ready"],
      ["Sound Proof", "🔇", "Noise reduction"],
      ["Wine Cellar", "🍷", "Premium storage"],
      ["Home Theater", "🎬", "Entertainment system"],
      ["Sauna", "🧖", "Wellness feature"],
      ["Jacuzzi", "🛁", "Luxury bathing"],
      ["Smart Irrigation", "💦", "Automated gardening"],
      ["Backup Generator", "⚡", "Power backup"]
    ];

    for (const item of features) {
      await connection.query(
        `INSERT IGNORE INTO features (name, icon, description) VALUES (?, ?, ?)`,
        item
      );
    }

    console.log("✅ Features seeded");

    console.log("🎉 Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
  } finally {
    connection.release();
  }
}

seedDatabase();