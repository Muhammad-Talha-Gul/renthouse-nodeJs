const db = require('../../config/db');
const index = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories WHERE active_status = ?", [1]);
        res.status(200).json({ message: "Admin Categories Controller is working!", results: rows });
    } catch (error) {
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

const store = async (req, res) => {
    try {
        const { name, details, status, icon } = req.body;
        const result = await req.db.query(
            "INSERT INTO categories (user_id, name, details, active_status, icon) VALUES (?, ?, ?, ?, ?)",
            [1, name, details, status, icon] // Assuming user_id is 1 for now
        );
        res.status(200).json({ message: "Category created successfully!", result: result });
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
