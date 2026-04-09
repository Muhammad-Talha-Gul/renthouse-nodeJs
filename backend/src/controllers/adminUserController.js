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
exports.fieldsPermissionUpdate = async (req, res) => {
  try {
    const recordId = req.params.id;
    const permissionsPayload = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [recordId]
    );

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const formatPermissions = (data) => {
      const result = {};

      for (const module in data) {
        const moduleFields = data[module].fields || {};
        const filteredFields = {};

        for (const fieldName in moduleFields) {
          const perms = moduleFields[fieldName];

          const allowed = Object.keys(perms)
            .filter((key) => perms[key] === true)
            .join("|");

          if (allowed) {
            filteredFields[fieldName] = allowed;
          }
        }

        if (Object.keys(filteredFields).length > 0) {
          result[module] = filteredFields;
        }
      }

      return result;
    };

    const formattedPermissions = formatPermissions(permissionsPayload);

    await db.query(
      "UPDATE users SET permited_fields = ? WHERE id = ?",
      [JSON.stringify(formattedPermissions), recordId]
    );

    return res.status(200).json({
      message: "Permissions updated successfully",
      success: true,
      permissions: formattedPermissions,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
exports.modulesPermissionUpdate = async (req, res) => {
  try {
    const recordId = req.params.id;
    const permissionsPayload = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [recordId]
    );

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    const formatModulePermissions = (data) => {
      const result = {};

      for (const module in data) {
        const perms = data[module];

        // Convert true permissions to string
        const allowed = ["read", "create", "update", "delete"]
          .filter((key) => perms[key] === true)
          .join("|");

        // ✅ Only keep module if at least one permission exists
        if (allowed) {
          result[module] = allowed;
        }
      }

      return result;
    };

    const formattedPermissions = formatModulePermissions(permissionsPayload);

    await db.query(
      "UPDATE users SET permissions = ? WHERE id = ?",
      [JSON.stringify(formattedPermissions), recordId]
    );

    return res.status(200).json({
      message: "Module permissions updated successfully",
      success: true,
      permissions: formattedPermissions,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};