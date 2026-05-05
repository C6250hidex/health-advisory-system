const jwt = require("jsonwebtoken");

/**
 * Higher-order middleware to handle JWT authentication and role-based authorization.
 * @param {Array} roles - Optional array of roles allowed to access the route (e.g., ['admin', 'doctor'])
 */
const authorize = (roles = []) => {
  return (req, res, next) => {
    // 1. Get the Authorization header
    const authHeader = req.header("Authorization");

    // 2. CHECK: Does the header exist and does it follow the "Bearer <token>" format?
    // This is a common point of failure for 401 errors.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access Denied: No valid token provided. Please log in.",
      });
    }

    // 3. EXTRACTION: Split the "Bearer " string to get only the token
    const token = authHeader.split(" ")[1];

    try {
      // 4. VERIFICATION: Unlock the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user data (id, role, is_verified) to the request object
      req.user = decoded;

      // 5. ROLE-BASED CHECK: If roles are specified, check if user's role is allowed
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Forbidden: You do not have permission to access this resource. Required: ${roles.join(" or ")}`,
        });
      }

      // 6. SUCCESS: Move to the next function (the controller)
      next();
    } catch (err) {
      // 7. ERROR HANDLING: Token might be expired or the secret key doesn't match
      console.error("JWT Middleware Error:", err.message);
      return res.status(401).json({
        message:
          "Your session has expired or the token is invalid. Please login again.",
      });
    }
  };
};

module.exports = authorize;
