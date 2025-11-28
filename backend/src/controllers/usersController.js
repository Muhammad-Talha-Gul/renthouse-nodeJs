const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
exports.index = async (req, res) => {
    try {
        const pool = req.db || db;

        // --- Pagination ---
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const per_page = Math.min(100, Math.max(1, parseInt(req.query.per_page, 8) || 8));
        const offset = (page - 1) * per_page;

        // --- Filters ---
        const filters = [];
        const params = [];

        // Name filter
        if (req.query.name && req.query.name.trim()) {
            filters.push('name LIKE ?');
            params.push(`%${req.query.name.trim()}%`);
        }

        // Email filter
        if (req.query.email && req.query.email.trim()) {
            filters.push('email LIKE ?');
            params.push(`%${req.query.email.trim()}%`);
        }

        // Status filter
        if (req.query.status !== undefined && req.query.status !== '') {
            filters.push('active_status = ?');
            params.push(req.query.status);
        }

        // Role filter
        if (req.query.role !== undefined && req.query.role !== '') {
            filters.push('role_id = ?');
            params.push(req.query.role);
        }

        const whereSql = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

        // --- Get Total Count ---
        const [countRows] = await pool.query(
            `SELECT COUNT(*) AS total FROM users ${whereSql}`,
            params
        );
        const total = countRows?.[0]?.total ?? 0;

        // --- Fetch Paginated Rows ---
        const query = `SELECT * FROM users ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const [rows] = await pool.query(query, [...params, per_page, offset]);

        return res.status(200).json({
            message: "Users fetched successfully",
            status: true,
            data: rows,
            pagination: {
                page,
                per_page,
                total,
                total_pages: Math.max(1, Math.ceil(total / per_page))
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error
        });
    }
};


exports.getModulesAndFields = async (req, res) => {
    try {
        // Get all tables from database (modules)
        const [tables] = await db.query(`
            SELECT TABLE_NAME as module_name 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME NOT IN ('migrations', 'password_resets', 'failed_jobs')
        `, [process.env.DB_NAME]);

        // Get fields for each table
        const modulesWithFields = await Promise.all(
            tables.map(async (table) => {
                const [fields] = await db.query(`
                    SELECT COLUMN_NAME as field_name, DATA_TYPE as data_type
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
                    AND COLUMN_NAME NOT IN ('id', 'created_at', 'updated_at', 'deleted_at', 'password')
                `, [process.env.DB_NAME, table.module_name]);

                return {
                    module: table.module_name,
                    fields: fields.map(field => field.field_name)
                };
            })
        );

        return res.status(200).json({
            message: "Modules and fields fetched successfully",
            status: true,
            data: modulesWithFields,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error
        });
    }
};