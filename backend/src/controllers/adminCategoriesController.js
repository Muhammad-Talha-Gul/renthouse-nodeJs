const db = require('../../config/db');
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories ORDER BY id DESC");
        res.status(200).json({
            message: "Admin Categories Controller is working!",
            results: rows
        });
    } catch (error) {
        if (process.env.NODE_ENV === 'production') {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(500).json({
                error: {
                    message: error.message || 'Unknown error',
                    stack: error.stack,
                    sqlMessage: error.sqlMessage || null,
                    code: error.code || null
                }
            });
        }
    }
}


const store = async (req, res) => {
    try {
        const { name, details, status, icon, slug } = req.body;

        const { id, email } = req.user;

        // Check if slug or category name already exists
        const [existingCategory] = await req.db.query(
            "SELECT * FROM categories WHERE slug = ? OR name = ?",
            [slug, name]
        );

        if (existingCategory.length > 0) {
            const existing = existingCategory[0];
            let errorField = [];

            if (existing.slug === slug) {
                errorField.push(`slug "${slug}"`);
            }
            if (existing.name === name) {
                errorField.push(`name "${name}"`);
            }

            return res.status(409).json({
                error: `Category with this ${errorField.join(' and ')} already exists`
            });
        }

        const [insertResult] = await req.db.query(
            "INSERT INTO categories (user_id, name, details, active_status, icon,slug) VALUES (?, ?, ?, ?, ?,?)",
            [id, name, details, status, icon, slug] // Assuming user_id is 1 for now
        );

        const [rows] = await req.db.query(
            "SELECT * FROM categories WHERE id = ?",
            [insertResult.insertId]
        );
        res.status(200).json({ message: "Category created successfully!", data: rows[0] });
    } catch (error) {
        console.error('adminCategoriesController.store error:', error);
        if (process.env.NODE_ENV === 'production') {
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Provide safe, useful debugging info during development
            res.status(500).json({
                error: {
                    message: error.message || 'Unknown error',
                    stack: error.stack,
                    sqlMessage: error.sqlMessage || null,
                    code: error.code || null
                }
            });
        }
    }
}

module.exports = { index, store }; // ✅ Export both
