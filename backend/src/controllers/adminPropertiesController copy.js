const db = require("../config/db");
const slugify = require("slugify");
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

    // ===============================
    // 🔹 Response
    // ===============================

    const [categories] = await db.query(
      "SELECT * FROM categories WHERE active_status = ?",
      [1]
    );
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: rows,
      categories: categories,
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
  // Wrap multer as a Promise
  const uploadFiles = () =>
    new Promise((resolve, reject) => {
      upload.fields([
        { name: 'banner_image', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ])(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

  try {
    // First, handle file uploads
    await uploadFiles();

    const {
      category_id, title, description, listing_type, price, bedrooms, bathrooms,
      area, area_unit, furnished, address, city, state, country, latitude,
      longitude, status, slug,
    } = req.body;

    const userId = req.user?.id;
    const finalSlug = slug ? slug : require('slugify')(title, { lower: true, strict: true });

    // Check for existing slug/title
    const [existingSlug] = await req.db.query(
      "SELECT * FROM properties WHERE slug = ?",
      [finalSlug]
    );

    if (existingSlug.length > 0) {
      return res.status(404).json({ error: 'Slug or title already exists' });
    }

    // Insert property
    const [insertResult] = await req.db.query(
      `INSERT INTO properties (
        category_id, title, description, listing_type, price, bedrooms, bathrooms,
        area, area_unit, furnished, address, city, state, country, latitude,
        longitude, status, slug, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id, title, description || null, listing_type, price,
        bedrooms || null, bathrooms || null, area || null, area_unit || "sqft",
        furnished || null, address || null, city || null, state || null, country || null,
        latitude || null, longitude || null, status || "available", finalSlug, userId
      ]
    );

    const propertyId = insertResult.insertId;

    // Handle images
    const bannerImage = req.files?.banner_image?.[0];
    const galleryImages = req.files?.images || [];

    if (bannerImage) {
      await req.db.query(
        `INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 1)`,
        [propertyId, `/uploads/properties/${bannerImage.filename}`]
      );
    }

    if (galleryImages.length > 0) {
      const galleryValues = galleryImages.map(img => [propertyId, `/uploads/properties/${img.filename}`, 0]);
      await req.db.query(
        `INSERT INTO property_images (property_id, image_url, is_primary) VALUES ?`,
        [galleryValues]
      );
    }

    const [propertyRows] = await req.db.query(
      "SELECT * FROM properties WHERE id = ?",
      [propertyId]
    );
    const [propertyImages] = await req.db.query(
      "SELECT * FROM property_images WHERE property_id = ?",
      [propertyId]
    );

    res.status(200).json({
      message: "Property created successfully!",
      data: { ...propertyRows[0], images: propertyImages },
      status: 200,
    });

  } catch (error) {
    console.error("adminPropertiesController.store error:", error);
    res.status(500).json({
      error: {
        message: error.message || "Unknown error",
        stack: error.stack,
        sqlMessage: error.sqlMessage || null,
        code: error.code || null,
      },
    });
  }
};

module.exports = { index, store };