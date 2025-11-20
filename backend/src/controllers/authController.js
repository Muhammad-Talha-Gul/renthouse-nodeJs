const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // token expires in 1 day
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // secure only in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // ✅ Return success response with token
        return res.status(200).json({
            message: "Login successful",
            status: true,
            token: token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full Name, Email, and Password are required' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
            [fullName, email, hashedPassword, phone]
        );

        return res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('authController.register error:', error);

        // Return detailed error for debugging
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message || error
        });
    }

}
