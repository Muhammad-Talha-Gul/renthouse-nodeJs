const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );

    const user = await db.query("SELECT * FROM users WHERE id =?", [result.insertId]);
    const userData = user[0]
    return res.status(200).json({
      message: "User registered successfully",
      user: userData[0],
      success: true,
      userId: result.insertId,
    });
  } catch (error) {
    console.error("authController.register error:", error);

    // Return detailed error for debugging (development mode)
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        message: error.message || "Unknown error",
        stack: error.stack || null,
        code: error.code || null,
        sqlMessage: error.sqlMessage || null,
        sql: error.sql || null,
      },
    });
  }


};
exports.update = async (req, res) => {
  try {
    const recordId = req.params.id;
    const { name, email, phone_number, active_status } = req.body;
    const [existingUser] = await db.query("SELECT * FROM users WHERE id = ?", [recordId]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(204).json({ message: "Record not found" });
    }
    await db.query("UPDATE users SET name = ?, email = ?, phone_number =?, active_status =? where id = ?",
      [name, email, phone_number, active_status, recordId]);

    const [updatedRecord] = await db.query("SELECT * FROM users WHERE id = ?", [recordId]);
    return res.status(200).json({
      message: "User Updated successfully",
      success: true,
      user: updatedRecord[0],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: {
        message: error.message || "Unknown error",
        stack: error.stack || null,
        code: error.code || null,
        sqlMessage: error.sqlMessage || null,
        sql: error.sql || null,
      },
    });
  };

}
