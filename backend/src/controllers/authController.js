const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const login = async (req, res) => {
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
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1d" } // token expires in 1 day
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // secure only in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // ✅ Return success response
        return res.status(200).json({
            message: "Login successful",
            status : true,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("authController.login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const register = async (req, res) => {
    try {

        const { fullName, email, password, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.query(
            "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
            [fullName, email, hashedPassword, phone]
        );
        return res.json({ message: 'User registered successfully', userId: result });
    } catch (error) {
        console.error('authController.register error:', error);
    }
}

module.exports = {
    login,
    register
};