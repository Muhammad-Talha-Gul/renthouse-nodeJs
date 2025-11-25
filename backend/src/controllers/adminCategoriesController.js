const db = require('../../config/db');
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
    try {
        const pool = req.db || db;

        // --- Pagination ---
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page, 10) || 10));
        const offset = (page - 1) * per_page;

        // --- Filters ---
        const filters = [];
        const params = [];

        if (req.query.name) {
            filters.push('name LIKE ?');
            params.push(`%${req.query.name}%`);
        }

        const statusValue = req.query.status ?? req.query.active_status;
        if (statusValue !== undefined && statusValue !== '') {
            const s = Number(statusValue);
            if (!Number.isNaN(s)) {
                filters.push('active_status = ?');
                params.push(s);
            }
        }

        const whereSql = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        // --- Total Count ---
        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM categories ${whereSql}`,
            params
        );
        const total = countRows?.[0]?.total ?? 0;

        // --- Fetch Paginated Rows ---
        const query = `SELECT * FROM categories ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(query, [...params, per_page, offset]);

        res.status(200).json({
            message: 'Admin Categories fetched successfully',
            data: rows,
            pagination: {
                page,
                per_page,
                total,
                total_pages: Math.max(1, Math.ceil(total / per_page))
            }
        });
    } catch (error) {
        const errorResponse = process.env.NODE_ENV === 'production'
            ? { error: 'Internal Server Error' }
            : {
                error: {
                    message: error.message || 'Unknown error',
                    stack: error.stack,
                    sqlMessage: error.sqlMessage || null,
                    code: error.code || null
                }
            };
        res.status(500).json(errorResponse);
    }
};



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
        res.status(200).json({ message: "Category created successfully!", data: rows[0], status: 200 });
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
const update = async (req, res) => {
    try {
        const { name, details, status, icon, slug } = req.body;

        // id comes from the URL: /categories/update/:id
        const categoryId = req.params.recordId;
        if (!categoryId) {
            return res.status(400).json({ error: 'Missing category id in URL' });
        }

        const { id: userId } = req.user || {};

        // Check if slug or category name already exists on another record
        const [existingCategory] = await req.db.query(
            "SELECT * FROM categories WHERE (slug = ? OR name = ?) AND id != ?",
            [slug, name, categoryId]
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

        const [updateResult] = await req.db.query(
            "UPDATE categories SET  name = ?, details = ?, active_status = ?, icon = ?, slug = ? WHERE id = ?",
            [name, details, status, icon, slug, categoryId]
        );

        if (!updateResult || updateResult.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const [rows] = await req.db.query(
            "SELECT * FROM categories WHERE id = ?",
            [categoryId]
        );

        res.status(200).json({ success: true, message: "Category updated successfully!", data: rows[0], status: 200 });
    } catch (error) {
        console.error('adminCategoriesController.update error:', error);
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
const distroy = async (req, res) => {
    try {

        const categoryId = req.params.recordId;
        if (!categoryId) {
            return res.status(400).json({ error: 'Missing category id in URL' });
        }
        // Fetch the category first so we can return it after deletion
        const [existingRows] = await req.db.query(
            "SELECT * FROM categories WHERE id = ?",
            [categoryId]
        );

        if (!existingRows || existingRows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const [deleteResult] = await req.db.query(
            "DELETE FROM categories WHERE id = ?",
            [categoryId]
        );

        if (!deleteResult || deleteResult.affectedRows === 0) {
            return res.status(500).json({ error: 'Failed to delete category' });
        }

        // Return the deleted record for client confirmation
        res.status(200).json({ success: true, message: "Category deleted successfully!", id: categoryId, status: 200 });
    } catch (error) {
        console.error('adminCategoriesController.distroy error:', error);
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

module.exports = { index, store, update, distroy }; // ✅ Export handlers
