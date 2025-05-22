const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";

// ✅ Verify JWT Token Middleware
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔹 Authorization Header:", authHeader); // Debugging log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided or incorrect format.");
    return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  const token = authHeader.split(" ")[1];
  console.log("✅ Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("✅ Token Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };


/*const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔹 Authorization Header:", authHeader); // Debugging log

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided or incorrect format.");
    return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  const token = authHeader.split(" ")[1];
  console.log("✅ Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log("✅ Token Decoded:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
*/


/*const jwt = require("jsonwebtoken");
const { db } = require("../config/firebase");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Access Denied. No token provided!" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
*/

/*const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  // Extract token from "Bearer ..." format
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token!" });
  }
};

module.exports = { verifyToken };
*/

/*const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  // Remove "Bearer " prefix if it exists
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token!" });
  }
};

module.exports = { verifyToken };
*/

/*const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from .env
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token!" });
  }
};

module.exports = { verifyToken };
*/
