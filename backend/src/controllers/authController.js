const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(204).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // token expires in 1 day
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Decode permissions safely
    let formattedPermissions = {};

    // Check if user.permissions exists and is a non-empty string
    if (user.permissions) {
      try {
        const decodedPermissions = JSON.parse(user.permissions);

        // Convert pipe-separated strings to arrays
        formattedPermissions = Object.fromEntries(
          Object.entries(decodedPermissions).map(([key, value]) => [
            key,
            typeof value === "string" ? value.split("|") : [],
          ]),
        );
      } catch (err) {
        console.error("Failed to parse permissions:", err);
        formattedPermissions = {}; // fallback if JSON.parse fails
      }
    } else {
      formattedPermissions = {}; // fallback if no permissions
    }

    return res.status(200).json({
      message: "Login successful",
      status: true,
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: formattedPermissions,
      },
    });
  } catch (error) {
    return res.status(204).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
      [fullName, email, hashedPassword, phone],
    );

    return res.status(200).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("authController.register error:", error);

    // Return detailed error for debugging
    return res.status(204).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }

};
exports.update = async (req, res) => {
  try {
    const recordId = req.params.id;
    const { fullName, email } = req.body;
    const [existingUser] = await db.query("SELECT * FROM users WHERE id = ?", [recordId]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(204).json({ message: "Record not found" });
    }
    await db.query("UPDATE users SET name = ?, email = ? where id = ?",
      [fullName, email, recordId]);

    const [updatedRecord] = await db.query("SELECT * FROM users WHERE id = ?", [recordId]);
    return res.status(200).json({
      message: "User Updated successfully",
      userId: updatedRecord[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  };

}
