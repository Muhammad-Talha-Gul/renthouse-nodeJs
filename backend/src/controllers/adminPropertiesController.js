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
    const [emenitiesFeature] = await db.query(
      "SELECT * FROM emenities_features WHERE active_status = ?",
      [1]
    );
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: rows,
      categories: categories,
      amunities: amunities,
      features: features,
      emenitiesFeature: emenitiesFeature,
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
    const {
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
      amenities,
      features,
      emenitiesFeature,
      instalment_available,
      down_payment,
      monthly_installment,
      installment_years,
      processing_fee,
      late_payment_fee,
      primary_image
    } = req.body;

    const userId = req.user?.id;

    // Parse amenities and features
    let amenitiesJson = null;
    let featuresJson = null;
    let emenitiesFeatureJson = null;

    if (amenities) {
      try {
        const amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        amenitiesJson = JSON.stringify(amenitiesArray);
      } catch (e) {
        amenitiesJson = null;
      }
    }

    if (features) {
      try {
        const featuresArray = typeof features === 'string' ? JSON.parse(features) : features;
        featuresJson = JSON.stringify(featuresArray);
      } catch (e) {
        featuresJson = null;
      }
    }
    if (emenitiesFeature) {
      try {
        const emenitiesFeatureArray = typeof emenitiesFeature === 'string' ? JSON.parse(emenitiesFeature) : emenitiesFeature;
        emenitiesFeatureJson = JSON.stringify(emenitiesFeatureArray);
      } catch (e) {
        emenitiesFeatureJson = null;
      }
    }

    const finalSlug = slug
      ? slug
      : slugify(title, { lower: true, strict: true });

    // Handle file uploads
    let bannerImagePath = null;
    const bannerFile = req.files?.find(f => f.fieldname === 'banner_image');
    if (bannerFile) {
      bannerImagePath = '/uploads/properties/' + path.basename(bannerFile.path);
    }

    let imagesPaths = [];
    const imageFiles = req.files?.filter(f => f.fieldname === 'images[]' || f.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      imagesPaths = imageFiles.map(file => '/uploads/properties/' + path.basename(file.path));
    }

    // Check if slug or title already exists
    const [existingSlug] = await req.db.query(
      "SELECT * FROM properties WHERE slug = ? OR title = ?",
      [finalSlug, title],
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
        status: false
      });
    }

    // Insert property
    const [insertResult] = await req.db.query(
      `INSERT INTO properties (
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
        user_id,
        amenities,
        features,
        emenities_features,
        instalment_available,
        down_payment,
        monthly_installment,
        installment_years,
        processing_fee,
        late_payment_fee
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        userId,
        amenitiesJson,
        featuresJson,
        emenitiesFeatureJson,
        instalment_available === 'true' || instalment_available === true ? 1 : 0,
        down_payment || null,
        monthly_installment || null,
        installment_years || null,
        processing_fee || null,
        late_payment_fee || null
      ]
    );

    const propertyId = insertResult.insertId;

    // Insert banner image into property_images table
    // if (bannerImagePath) {
    //   await req.db.query(
    //     "INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, ?)",
    //     [propertyId, bannerImagePath, 1]
    //   );
    // }

    // Insert gallery images
    const primaryIndex = parseInt(primary_image) || 0;
    for (let i = 0; i < imagesPaths.length; i++) {
      await req.db.query(
        "INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, ?)",
        [propertyId, imagesPaths[i], i === primaryIndex ? 1 : 0]
      );
    }

    // Fetch the complete property
    const [propertyRows] = await req.db.query(
      "SELECT * FROM properties WHERE id = ?",
      [propertyId]
    );

    // Fetch images separately
    const [imageRows] = await req.db.query(
      "SELECT id, image_url, is_primary FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, id ASC",
      [propertyId]
    );

    // Combine data
    const property = propertyRows[0];
    property.images = imageRows;

    // Parse JSON fields
    if (property.amenities) {
      property.amenities = typeof property.amenities === 'string'
        ? JSON.parse(property.amenities)
        : property.amenities;
    }
    if (property.features) {
      property.features = typeof property.features === 'string'
        ? JSON.parse(property.features)
        : property.features;
    }

    res.status(200).json({
      message: "Property created successfully!",
      data: property,
      status: 200,
      success: true
    });
  } catch (error) {
    console.error("adminPropertiesController.store error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      status: false
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
      amenities,
      features,
      emenitiesFeature,
      instalment_available,
      down_payment,
      monthly_installment,
      installment_years,
      processing_fee,
      late_payment_fee,
      primary_image
    } = req.body;

    const userId = req.user?.id;

    // Parse amenities and features if they're JSON strings or arrays
    let amenitiesJson = null;
    let featuresJson = null;
    let emenitiesFeatureJson = null;

    if (amenities) {
      try {
        const amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        amenitiesJson = JSON.stringify(amenitiesArray);
      } catch (e) {
        amenitiesJson = null;
      }
    }

    if (features) {
      try {
        const featuresArray = typeof features === 'string' ? JSON.parse(features) : features;
        featuresJson = JSON.stringify(featuresArray);
      } catch (e) {
        featuresJson = null;
      }
    }
    if (emenitiesFeature) {
      try {
        const femenitiesFeatureArray = typeof femenitiesFeature === 'string' ? JSON.parse(femenitiesFeature) : femenitiesFeature;
        emenitiesFeatureJson = JSON.stringify(femenitiesFeatureArray);
      } catch (e) {
        emenitiesFeatureJson = null;
      }
    }

    const finalSlug = slug
      ? slug
      : slugify(title, { lower: true, strict: true });

    // Handle file uploads
    let bannerImagePath = null;
    const bannerFile = req.files?.find(f => f.fieldname === 'banner_image');
    if (bannerFile) {
      bannerImagePath = '/uploads/properties/' + path.basename(bannerFile.path);
    }

    let newImagesPaths = [];
    const imageFiles = req.files?.filter(f => f.fieldname === 'images[]' || f.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      newImagesPaths = imageFiles.map(file => '/uploads/properties/' + path.basename(file.path));
    }

    // Check if property exists and user owns it
    const [propertyCheck] = await req.db.query(
      "SELECT * FROM properties WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (propertyCheck.length === 0) {
      return res.status(404).json({
        error: "Property not found or you don't have permission to update it",
        status: false
      });
    }

    // Check if slug or title already exists (excluding current property)
    const [existingSlug] = await req.db.query(
      "SELECT * FROM properties WHERE (slug = ? OR title = ?) AND id != ?",
      [finalSlug, title, id]
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
        status: false
      });
    }

    // Build update query dynamically
    let updateFields = `
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
      amenities = ?,
      emenities_features = ?,
      emenitiesFeature = ?,
      instalment_available = ?,
      down_payment = ?,
      monthly_installment = ?,
      installment_years = ?,
      processing_fee = ?,
      late_payment_fee = ?,
      updated_at = NOW()
    `;

    const updateValues = [
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
      amenitiesJson,
      featuresJson,
      emenitiesFeatureJson,
      instalment_available === 'true' || instalment_available === true ? 1 : 0,
      down_payment || null,
      monthly_installment || null,
      installment_years || null,
      processing_fee || null,
      late_payment_fee || null
    ];

    // Add banner image if provided
    if (bannerImagePath) {
      updateFields += `, banner_image = ?`;
      updateValues.push(bannerImagePath);
    }

    updateValues.push(id, userId);

    // Update property
    await req.db.query(
      `UPDATE properties SET ${updateFields} WHERE id = ? AND user_id = ?`,
      updateValues
    );

    // Update banner image in property_images table
    // if (bannerImagePath) {
    //   const [existingBanner] = await req.db.query(
    //     "SELECT id FROM property_images WHERE property_id = ? AND is_primary = 1",
    //     [id]
    //   );

    //   if (existingBanner.length > 0) {
    //     await req.db.query(
    //       "UPDATE property_images SET image_url = ? WHERE property_id = ? AND is_primary = 1",
    //       [bannerImagePath, id]
    //     );
    //   } else {
    //     await req.db.query(
    //       "INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, 1)",
    //       [id, bannerImagePath]
    //     );
    //   }
    // }

    // Add new gallery images
    const primaryIndex = parseInt(primary_image) || 0;
    for (let i = 0; i < newImagesPaths.length; i++) {
      await req.db.query(
        "INSERT INTO property_images (property_id, image_url, is_primary) VALUES (?, ?, ?)",
        [id, newImagesPaths[i], i === primaryIndex ? 1 : 0]
      );
    }

    // Update primary image flag if needed
    if (primary_image !== undefined && newImagesPaths.length === 0) {
      // Reset all primary flags
      await req.db.query(
        "UPDATE property_images SET is_primary = 0 WHERE property_id = ?",
        [id]
      );
      // Set new primary image
      await req.db.query(
        "UPDATE property_images SET is_primary = 1 WHERE property_id = ? AND id = ?",
        [id, primary_image]
      );
    }

    // Fetch the updated property with images
    const [rows] = await req.db.query(`
      SELECT p.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', pi.id, 'url', pi.image_url, 'is_primary', pi.is_primary)
        ) FROM property_images pi WHERE pi.property_id = p.id) as images
      FROM properties p
      WHERE p.id = ?
    `, [id]);

    // Parse JSON fields for response
    if (rows[0]) {
      if (rows[0].amenities) {
        rows[0].amenities = JSON.parse(rows[0].amenities);
      }
      if (rows[0].features) {
        rows[0].features = JSON.parse(rows[0].features);
      }
      if (rows[0].images) {
        rows[0].images = JSON.parse(rows[0].images);
      }
    }

    res.status(200).json({
      message: "Property updated successfully!",
      data: rows[0],
      status: 200,
      success: true
    });
  } catch (error) {
    console.error("adminPropertiesController.update error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      status: false
    });
  }
};
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await req.db.query(`
      SELECT p.*, 
        GROUP_CONCAT(DISTINCT a.id) as amenity_ids,
        GROUP_CONCAT(DISTINCT a.name) as amenity_names,
        GROUP_CONCAT(DISTINCT f.id) as feature_ids,
        GROUP_CONCAT(DISTINCT f.name) as feature_names,
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', pi.id, 'url', pi.image_url, 'is_primary', pi.is_primary)
        ) FROM property_images pi WHERE pi.property_id = p.id) as images
      FROM properties p
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      LEFT JOIN amenities a ON pa.amenity_id = a.id
      LEFT JOIN property_features pf ON p.id = pf.property_id
      LEFT JOIN features f ON pf.feature_id = f.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Property not found",
        status: false
      });
    }

    // Parse JSON arrays
    const property = rows[0];
    if (property.images) {
      property.images = JSON.parse(property.images);
    }
    if (property.amenity_ids) {
      property.amenities = property.amenity_ids.split(',').map(Number);
    }
    if (property.feature_ids) {
      property.features = property.feature_ids.split(',').map(Number);
    }

    res.status(200).json({
      data: property,
      status: true
    });
  } catch (error) {
    console.error("adminPropertiesController.getPropertyById error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      status: false
    });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { propertyId, imageId } = req.params;
    const userId = req.user?.id;

    // Verify property ownership
    const [property] = await req.db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, userId]
    );

    if (property.length === 0) {
      return res.status(404).json({
        error: "Property not found or you don't have permission",
        status: false
      });
    }

    // Check if image exists
    const [image] = await req.db.query(
      "SELECT image_url, is_primary FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, propertyId]
    );

    if (image.length === 0) {
      return res.status(404).json({
        error: "Image not found",
        status: false
      });
    }

    // Delete image file from server
    const fs = require('fs');
    const imagePath = path.join(__dirname, '..', image[0].image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from database
    await req.db.query(
      "DELETE FROM property_images WHERE id = ? AND property_id = ?",
      [imageId, propertyId]
    );

    // If deleted image was primary, set another image as primary
    if (image[0].is_primary === 1) {
      const [nextImage] = await req.db.query(
        "SELECT id FROM property_images WHERE property_id = ? LIMIT 1",
        [propertyId]
      );

      if (nextImage.length > 0) {
        await req.db.query(
          "UPDATE property_images SET is_primary = 1 WHERE id = ?",
          [nextImage[0].id]
        );
      }
    }

    res.status(200).json({
      message: "Image deleted successfully",
      status: true
    });
  } catch (error) {
    console.error("adminPropertiesController.deleteImage error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      status: false
    });
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