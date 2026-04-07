const db = require("../config/db");

const indexController = async (req, res) => {
  try {
    const pool = req.db || db;

    // Fetch featured properties (latest 6 properties)
    const [properties] = await pool.query(`
        SELECT
            p.id,
            p.title,
            p.price,
            p.city AS location,
            p.bedrooms,
            p.bathrooms,
            p.area,
            p.area_unit,
            -- use property_images.primary image if exists, otherwise fallback to banner_image
            COALESCE(pi.image_url, p.banner_image) AS image
        FROM properties p
        LEFT JOIN property_images pi 
            ON p.id = pi.property_id AND pi.is_primary = 1
        WHERE p.status = 'available'
        ORDER BY p.id DESC
        LIMIT 6
        `);

    // Format the data to match frontend expectations
    const featuredProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      image: property.image
        ? `${property.image}`
        : "https://via.placeholder.com/400x300",
      price: `$${property.price.toLocaleString()}`,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: `${property.area} ${property.area_unit}`,
    }));

    const [propertyCategories] = await pool.query(
      "SELECT * FROM categories WHERE active_status = ?",
      [1]
    );

    res.json({
      featuredProperties,
      propertyCategories: propertyCategories, // You can add logic to fetch property types if needed
      testimonials: [], // Add testimonials if available
      blogPosts: [], // Add blog posts if available
      success: true,
      message: "This is Talha"
    });
  } catch (error) {
    console.error("Error fetching index data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the controller function
module.exports = indexController;
