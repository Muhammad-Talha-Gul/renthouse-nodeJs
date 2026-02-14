const db = require("../config/db");

const index = async (req, res) => {
    try {
        const pool = req.db || db;
        const userId = req.user?.id;

        const [result] = await db.query(`
            SELECT 
            p.*,
            u.name,
            u.phone_number,
            u.email

            FROM properties p
            INNER JOIN users u
            ON u.id = p.user_id
              WHERE p.user_id =? `, [userId]);
        res.json({ message: 'Property Index Function is Calling!', data: result });
    } catch {

    }
}


module.exports = { index };