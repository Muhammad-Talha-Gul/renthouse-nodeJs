const jwt = require("jsonwebtoken");
const db = require("../src/config/db");

module.exports = (requiredPermissionKey = null) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;
      if (!token) {
        return res.status(404).json({ error: "Unauthorized: Token missing" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // decoded should have user id or email

      // Fetch user permissions from DB
      const [userRows] = await db.query(
        "SELECT permissions FROM users WHERE id = ?",
        [decoded.id], // or decoded.userId
      );

      if (!userRows || userRows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = userRows[0];

      // Parse permissions JSON
      let permissions = {};
      try {
        permissions = JSON.parse(user.permissions || "{}");
      } catch (err) {
        permissions = {};
      }

      // Convert pipe-separated strings to arrays
      const formattedPermissions = Object.fromEntries(
        Object.entries(permissions).map(([key, value]) => [
          key,
          typeof value === "string" ? value.split("|") : [],
        ]),
      );
      if (!requiredPermissionKey) {
        req.permissions = formattedPermissions;
        return next();
      }

      let requiredPermission = "";
      switch (req.method) {
        case "GET":
          requiredPermission = "read";
          break;
        case "POST":
          requiredPermission = "create";
          break;
        case "PUT":
        case "PATCH":
          requiredPermission = "update";
          break;
        case "DELETE":
          requiredPermission = "delete";
          break;
      }

      const userPermissions = formattedPermissions[requiredPermissionKey] || [];

      // ✅ Must have action permission (read/create/update/delete)
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(404).json({
          error: "Forbidden: Permission denied",
          permissions: userPermissions,
        });
      }

      req.canViewAll = userPermissions.includes("all");
      req.permissions = formattedPermissions;

      next();
    } catch (err) {
      console.error(err);
      return res.status(404).json({
        error: "Invalid or expired token",
        details: err.message,
      });
    }
  };
};
