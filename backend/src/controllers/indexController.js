const db = require("../config/db");

const index = async (req, res) => {
  try {
    const pool = req.db || db;

    // Fetch featured properties (latest 6 properties) along with emenities_features
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
        COALESCE(pi.image_url, p.banner_image) AS image,
        p.emenities_features
      FROM properties p
      LEFT JOIN property_images pi 
        ON p.id = pi.property_id AND pi.is_primary = 1
      WHERE p.status = 'available'
      ORDER BY p.id DESC
      LIMIT 6
    `);

    // Fetch all active amenities/features
    const [featuresRows] = await pool.query(
      "SELECT id, name, icon, type FROM emenities_features WHERE active_status = ?",
      [1]
    );

    const featuresMap = {};
    featuresRows.forEach(f => {
      featuresMap[f.id] = { id: f.id, name: f.name, icon: f.icon, type: f.type };
    });

    // Format properties
    const featuredProperties = properties.map(property => {
      let propertyFeatures = [];

      // Safely parse JSON if not null
      if (property.emenities_features) {
        try {
          const ids = JSON.parse(property.emenities_features);
          if (Array.isArray(ids)) {
            propertyFeatures = ids
              .map(id => featuresMap[id])
              .filter(f => f !== undefined);
          }
        } catch (err) {
          console.warn(`Invalid JSON in emenities_features for property ${property.id}`);
        }
      }

      return {
        id: property.id,
        title: property.title,
        image: property.image || "https://via.placeholder.com/400x300",
        price: `$${property.price.toLocaleString()}`,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: `${property.area} ${property.area_unit}`,
        amenities_features: propertyFeatures
      };
    });

    // Fetch active property categories
    const [propertyCategories] = await pool.query(
      "SELECT * FROM categories WHERE active_status = ?",
      [1]
    );

    res.json({
      featuredProperties,
      propertyCategories,
      testimonials: [],
      blogPosts: [],
      success: true,
      message: "Data fetched successfully"
    });

  } catch (error) {
    console.error("Error fetching index data:", error);
    res.status(500).json({ message: error.message }); // show actual error
  }
};

const details = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received property ID:', id);

    const pool = req.db || db;

    // Fetch property details with agent and category
    const [propertyRows] = await pool.query(`
      SELECT
        p.*,
        c.name as category_name,
        u.name as agent_name,
        u.profile_image as profile_image,
        u.email as agent_email,
        u.phone_number as agent_phone
      FROM properties p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.status = 'available'
    `, [id]);

    if (propertyRows.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = propertyRows[0];

    // Fetch property images
    const [images] = await pool.query(`
      SELECT image_url, is_primary
      FROM property_images
      WHERE property_id = ?
      ORDER BY is_primary DESC, created_at ASC
    `, [id]);

    // ✅ Parse emenities_features array
    let featureIds = [];

    if (property.emenities_features) {
      try {
        featureIds = JSON.parse(property.emenities_features);
      } catch (e) {
        console.error('Invalid JSON in emenities_features');
      }
    }

    let features = [];
    let amenities = [];

    if (featureIds.length > 0) {
      const [featuresRows] = await pool.query(`
        SELECT id, name, icon, description, type
        FROM emenities_features
        WHERE id IN (?)
      `, [featureIds]);
      amenities = featuresRows;
    }

    // Format response
    const formattedProperty = {
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.city}, ${property.state}`,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: `${property.area} ${property.area_unit}`,
      description: property.description,
      features,
      amenities,
      images: images.map(img => `${process.env.baseURL}${img.image_url}`),
      videos: [],
      agent: {
        name: property.agent_name || 'Agent',
        phone: property.agent_phone || '',
        email: property.agent_email || '',
        avatar: `${process.env.baseURL}${property.profile_image}`
      },
      category: property.category_name,
      listing_type: property.listing_type,
      address: property.address,
      created_at: property.created_at
    };

    res.json(formattedProperty);

  } catch (error) {
    console.error("Error fetching index data:", error);
    res.status(500).json({ message: error.message });
  }
};
// Export the controller function
module.exports = { index, details };
