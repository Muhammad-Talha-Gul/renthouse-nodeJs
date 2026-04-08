const db = require("../config/db");
const slugify = require("slugify");
const path = require("path");
const fs = require('fs');
const index = async (req, res) => {
  try {
    const pool = req.db || db;
    const userId = req.user?.id;

    // ===============================
    // 🔹 Pagination
    // ===============================
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(
      100,
      Math.max(1, parseInt(req.query.per_page) || 10)
    );
    const offset = (page - 1) * per_page;

    // ===============================
    // 🔹 Filters
    // ===============================
    const filters = [];
    const params = [];

    // If user cannot view all, only show own properties
    if (!req.canViewAll) {
      filters.push("p.user_id = ?");
      params.push(userId);
    }

    if (req.query.category_id) {
      filters.push("p.category_id = ?");
      params.push(req.query.category_id);
    }

    if (req.query.city) {
      filters.push("p.city LIKE ?");
      params.push(`%${req.query.city}%`);
    }

    if (req.query.listing_type) {
      filters.push("p.listing_type = ?");
      params.push(req.query.listing_type);
    }

    if (req.query.status) {
      filters.push("p.status = ?");
      params.push(req.query.status);
    }

    const whereSql = filters.length
      ? `WHERE ${filters.join(" AND ")}`
      : "";

    // ===============================
    // 🔹 Total Count Query
    // ===============================
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total
       FROM properties p
       ${whereSql}`,
      params
    );

    const total = countRows[0].total;

    // ===============================
    // 🔹 Data Query
    // ===============================
    const [rows] = await pool.query(
      `
      SELECT 
        p.*,
        u.name,
        u.phone_number,
        u.email
      FROM properties p
      INNER JOIN users u ON u.id = p.user_id
      ${whereSql}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, per_page, offset]
    );

    // Fetch images from property_images table
    for (let row of rows) {
      const [imgs] = await db.query("SELECT image_url, is_primary FROM property_images WHERE property_id = ? ORDER BY id", [row.id]);
      row.banner_image = imgs.find(i => i.is_primary)?.image_url || null;
      row.images = imgs.filter(i => !i.is_primary).map(i => i.image_url);
    }

    // ===============================
    // 🔹 Response
    // ===============================

    const [categories] = await db.query(
      "SELECT * FROM categories WHERE active_status = ?",
      [1]
    );
    const [amunities] = await db.query(
      "SELECT * FROM amenities WHERE active_status = ?",
      [1]
    );
    const [features] = await db.query(
      "SELECT * FROM features WHERE active_status = ?",
      [1]
    );
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: rows,
      categories: categories,
      amunities: amunities,
      features: features,
      pagination: {
        total,
        per_page,
        current_page: page,
        last_page: Math.ceil(total / per_page),
      },
    });
  } catch (error) {
    console.error("Property index error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};



const store = async (req, res) => {
  try {
    const { category_id, title, description, listing_type, price, bedrooms, bathrooms, area,
      area_unit,
      furnished,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      status,
      slug,
    } = req.body;

    const { id, email } = req.user;
    const userId = req.user?.id;

    const finalSlug = slug
      ? slug
      : slugify(title, { lower: true, strict: true });

    // Handle file uploads
    let bannerImagePath = null;
    const bannerFile = req.files.find(f => f.fieldname === 'banner_image');
    if (bannerFile) {
      bannerImagePath = '/uploads/properties/' + path.basename(bannerFile.path);
    }

    let imagesPaths = [];
    const imageFiles = req.files.filter(f => f.fieldname === 'images');
    if (imageFiles.length > 0) {
      imagesPaths = imageFiles.map(file => '/uploads/properties/' + path.basename(file.path));
    }


    // Check if slug or category name already exists
    const [existingSlug] = await req.db.query(
      "SELECT * FROM properties WHERE slug = ?",
      [finalSlug],
    );
    if (existingSlug.length > 0) {
      const existing = existingSlug[0];
      let errorField = [];

      if (existing.slug === finalSlug) {
        errorField.push(`slug "${finalSlug}"`);
      }
      if (existing.title === title) {
        errorField.push(`title "${title}"`);
      }

      return res.status(404).json({
        error: `Property with this ${errorField.join(" and ")} already exists`,
      });
    }

    const [insertResult] = await req.db.query(
      `
      INSERT INTO properties (
        category_id,
        title,
        description,
        listing_type,
        price,
        bedrooms,
        bathrooms,
        area,
        area_unit,
        furnished,
        address,
        city,
        state,
        country,
        latitude,
        longitude,
        status,
        slug,
        banner_image,
        images,
        user_id
      )
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_id,
        title,
        description || null,
        listing_type,
        price,
        bedrooms || null,
        bathrooms || null,
        area || null,
        area_unit || "sqft",
        furnished || null,
        address || null,
        city || null,
        state || null,
        country || null,
        latitude || null,
        longitude || null,
        status || "available",
        finalSlug,
        bannerImagePath,
        null, // images as JSON, but we'll use table
        userId,
      ]
    );

    const propertyId = insertResult.insertId;

    // Insert images into property_images table
    if (bannerImagePath) {
      await req.db.query("INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 1)", [propertyId, bannerImagePath]);
    }
    for (let img of imagesPaths) {
      await req.db.query("INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 0)", [propertyId, img]);
    }

    const [rows] = await req.db.query("SELECT * FROM properties WHERE id = ?", [
      insertResult.insertId,
    ]);
    res.status(200).json({
      message: "Property created successfully!",
      data: rows[0],
      status: 200,
    });
  } catch (error) {
    console.error("adminPropertiesController.store error:", error);
    if (process.env.NODE_ENV === "production") {
      res.status(404).json({ error: "Internal Server Error" });
    } else {
      res.status(404).json({
        error: {
          message: error.message || "Unknown error",
          stack: error.stack,
          sqlMessage: error.sqlMessage || null,
          code: error.code || null,
        },
      });
    }
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, title, description, listing_type, price, bedrooms, bathrooms, area,
      area_unit,
      furnished,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      status,
      slug,
    } = req.body;

    const userId = req.user?.id;

    const finalSlug = slug
      ? slug
      : slugify(title, { lower: true, strict: true });

    // Handle file uploads
    let bannerImagePath = null;
    const bannerFile = req.files.find(f => f.fieldname === 'banner_image');
    if (bannerFile) {
      bannerImagePath = '/uploads/properties/' + path.basename(bannerFile.path);
    }

    let imagesPaths = [];
    const imageFiles = req.files.filter(f => f.fieldname === 'images');
    if (imageFiles.length > 0) {
      imagesPaths = imageFiles.map(file => '/uploads/properties/' + path.basename(file.path));
    }

    // Check if slug or title already exists (excluding current property)
    const [existingSlug] = await req.db.query(
      "SELECT * FROM properties WHERE (slug = ? OR title = ?) AND id != ?",
      [finalSlug, title, id],
    );
    if (existingSlug.length > 0) {
      const existing = existingSlug[0];
      let errorField = [];

      if (existing.slug === finalSlug) {
        errorField.push(`slug "${finalSlug}"`);
      }
      if (existing.title === title) {
        errorField.push(`title "${title}"`);
      }

      return res.status(400).json({
        error: `Property with this ${errorField.join(" and ")} already exists`,
      });
    }

    await req.db.query(
      `
      UPDATE properties SET
        category_id = ?,
        title = ?,
        description = ?,
        listing_type = ?,
        price = ?,
        bedrooms = ?,
        bathrooms = ?,
        area = ?,
        area_unit = ?,
        furnished = ?,
        address = ?,
        city = ?,
        state = ?,
        country = ?,
        latitude = ?,
        longitude = ?,
        status = ?,
        slug = ?,
        ${bannerImagePath ? 'banner_image = ?,' : ''}
        ${imagesPaths.length > 0 ? 'images = ?,' : ''}
        updated_at = NOW()
      WHERE id = ? AND user_id = ?
      `,
      [
        category_id,
        title,
        description || null,
        listing_type,
        price,
        bedrooms || null,
        bathrooms || null,
        area || null,
        area_unit || "sqft",
        furnished || null,
        address || null,
        city || null,
        state || null,
        country || null,
        latitude || null,
        longitude || null,
        status || "available",
        finalSlug,
        ...(bannerImagePath ? [bannerImagePath] : []),
        ...(imagesPaths.length > 0 ? [null] : []), // set images to null
        id,
        userId,
      ]
    );

    // Delete old images and insert new
    if (bannerImagePath) {
      // Delete existing banner image
      await req.db.query("DELETE FROM property_images WHERE property_id = ? AND is_primary = 1", [id]);
      // Insert new banner
      await req.db.query("INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 1)", [id, bannerImagePath]);
    }
    // Insert new images without deleting old ones
    for (let img of imagesPaths) {
      await req.db.query("INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 0)", [id, img]);
    }

    const [rows] = await req.db.query("SELECT * FROM properties WHERE id = ?", [id]);
    res.status(200).json({
      message: "Property updated successfully!",
      data: rows[0],
      status: 200,
    });
  } catch (error) {
    console.error("adminPropertiesController.update error:", error);
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(500).json({
        error: {
          message: error.message || "Unknown error",
          stack: error.stack,
          sqlMessage: error.sqlMessage || null,
          code: error.code || null,
        },
      });
    }
  }
};

const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if property exists and belongs to user (if not admin)
    const [property] = await req.db.query(
      "SELECT * FROM properties WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (property.length === 0) {
      return res.status(404).json({ error: "Property not found or access denied" });
    }

    // Get associated images before deleting
    const [imgs] = await req.db.query("SELECT image_url FROM property_images WHERE property_id = ?", [id]);

    // Delete image files from filesystem
    for (let img of imgs) {
      const relativePath = img.image_url.replace('/uploads/', '');
      const filePath = path.join(__dirname, '../uploads', relativePath);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error deleting file:', filePath, err);
      }
    }

    await req.db.query("DELETE FROM properties WHERE id = ?", [id]);

    res.status(200).json({
      message: "Property deleted successfully!",
      status: 200,
    });
  } catch (error) {
    console.error("adminPropertiesController.destroy error:", error);
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(500).json({
        error: {
          message: error.message || "Unknown error",
          stack: error.stack,
          sqlMessage: error.sqlMessage || null,
          code: error.code || null,
        },
      });
    }
  }
};

const search = async (req, res) => {
  try {
    const pool = req.db || db;

    // =============================== 
    // 🔹 Pagination
    // ===============================
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 12));
    const offset = (page - 1) * per_page;

    // ===============================
    // 🔹 Filters
    // ===============================
    const filters = [];
    const params = [];

    // Search term (title, location, type)
    if (req.query.q) {
      filters.push("(p.title LIKE ? OR p.city LIKE ? OR p.address LIKE ?)");
      const searchTerm = `%${req.query.q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Property type (category)
    if (req.query.type) {
      filters.push("c.name = ?");
      params.push(req.query.type);
    }

    // Transaction type (listing_type)
    if (req.query.transaction) {
      filters.push("p.listing_type = ?");
      params.push(req.query.transaction);
    }

    // Price range
    if (req.query.minPrice) {
      filters.push("p.price >= ?");
      params.push(parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      filters.push("p.price <= ?");
      params.push(parseFloat(req.query.maxPrice));
    }

    // Bedrooms
    if (req.query.bedrooms && req.query.bedrooms !== 'Any') {
      if (req.query.bedrooms === '5+') {
        filters.push("p.bedrooms >= 5");
      } else {
        filters.push("p.bedrooms = ?");
        params.push(parseInt(req.query.bedrooms));
      }
    }

    // Bathrooms
    if (req.query.bathrooms && req.query.bathrooms !== 'Any') {
      if (req.query.bathrooms === '4+') {
        filters.push("p.bathrooms >= 4");
      } else {
        filters.push("p.bathrooms = ?");
        params.push(parseInt(req.query.bathrooms));
      }
    }

    // Location
    if (req.query.location) {
      filters.push("(p.city LIKE ? OR p.state LIKE ? OR p.country LIKE ?)");
      const locationTerm = `%${req.query.location}%`;
      params.push(locationTerm, locationTerm, locationTerm);
    }

    // Status (only show available properties for public)
    filters.push("p.status = 'available'");

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // ===============================
    // 🔹 Sorting
    // ===============================
    let orderBy = 'p.created_at DESC'; // default: newest
    switch (req.query.sort) {
      case 'price-low':
        orderBy = 'p.price ASC';
        break;
      case 'price-high':
        orderBy = 'p.price DESC';
        break;
      case 'featured':
        orderBy = 'p.created_at DESC'; // For now, treat recent as featured
        break;
      case 'popular':
        orderBy = 'p.created_at DESC'; // For now, treat recent as popular
        break;
    }

    // ===============================
    // 🔹 Query
    // ===============================
    const query = `
      SELECT
        p.id,
        p.title,
        p.price,
        p.listing_type as transaction,
        p.bedrooms,
        p.bathrooms,
        p.area,
        p.city,
        p.state,
        p.country,
        CONCAT(p.city, ', ', p.state) as location,
        c.name as type,
        pi.image_url as image,
        p.created_at,
        p.status
      FROM properties p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN property_images pi ON p.id = pi.property_id AND pi.is_primary = 1
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    params.push(per_page, offset);

    const [properties] = await pool.query(query, params);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM properties p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause.replace('p.status = \'available\'', 'p.status = \'available\'')}
    `;
    const [countResult] = await pool.query(countQuery, params.slice(0, -2)); // Remove LIMIT params
    const totalResults = countResult[0].total;

    // Format properties for frontend
    const formattedProperties = properties.map(property => ({
      id: property.id,
      title: property.title,
      price: property.price,
      image: property.image ? `http://localhost:5000${property.image}` : 'https://via.placeholder.com/500x300',
      type: property.type,
      transaction: property.transaction,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      featured: false, // Can be enhanced later
      favorite: false, // Can be enhanced later
      status: property.status
    }));

    res.json({
      properties: formattedProperties,
      pagination: {
        page,
        per_page,
        total: totalResults,
        total_pages: Math.ceil(totalResults / per_page)
      }
    });

  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const details = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Received property ID:', id);

    const pool = req.db || db;

    // Fetch property details with images
    const [propertyRows] = await pool.query(`
      SELECT
        p.*,
        c.name as category_name,
        u.name as agent_name,
        u.email as agent_email,
        u.phone_number as agent_phone
      FROM properties p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = ? AND p.status = 'available'
    `, [id]);

    console.log('Property rows found:', propertyRows.length);
    if (propertyRows.length === 0) {
      console.log('No property found with ID:', id);
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

    // Format the response
    const formattedProperty = {
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.city}, ${property.state}`,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: `${property.area} ${property.area_unit}`,
      description: property.description,
      features: property.furnished ? [property.furnished] : [],
      amenities: [], // Can be enhanced later
      images: images.map(img => `http://localhost:5000${img.image_url}`),
      videos: [], // Can be enhanced later
      agent: {
        name: property.agent_name || 'Agent',
        phone: property.agent_phone || '',
        email: property.agent_email || '',
        avatar: 'https://via.placeholder.com/100x100'
      },
      category: property.category_name,
      listing_type: property.listing_type,
      address: property.address,
      created_at: property.created_at
    };

    res.json(formattedProperty);

  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { index, store, update, destroy, search, details };