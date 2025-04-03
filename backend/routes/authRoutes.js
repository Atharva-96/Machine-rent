const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");
const admin = require("firebase-admin");

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// Generate Access & Refresh Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

// User Registration
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (!snapshot.empty) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { email, password: hashedPassword, name, createdAt: new Date() };
      const userDoc = await db.collection("users").add(newUser);

      const { accessToken, refreshToken } = generateTokens(userDoc.id);
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// User Login
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(userDoc.id);
    await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google Login
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "ID Token is required!" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    let userId;
    if (snapshot.empty) {
      const newUser = { email, name, profileImage: picture || "", createdAt: new Date(), provider: "google" };
      const userDoc = await db.collection("users").add(newUser);
      userId = userDoc.id;
    } else {
      userId = snapshot.docs[0].id;
    }

    const { accessToken, refreshToken } = generateTokens(userId);
    await db.collection("refreshTokens").doc(userId).set({ token: refreshToken });

    res.status(200).json({ message: "Google login successful!", accessToken, refreshToken, userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate user!" });
  }
});

// Refresh Token Endpoint
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const tokenDoc = await db.collection("refreshTokens").where("token", "==", refreshToken).get();
    if (tokenDoc.empty) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });
      const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (Invalidate Refresh Token)
router.post("/logout", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await db.collection("refreshTokens").doc(userId).delete();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/*const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");
const admin = require("firebase-admin");

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// 🔹 Generate Access & Refresh Tokens

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Short-lived
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived
  return { accessToken, refreshToken };
};

// 🔹 User Registration

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (!snapshot.empty) return res.status(400).json({ error: "User already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in Firestore
      const newUser = { email, password: hashedPassword, name, createdAt: new Date() };
      const userDoc = await db.collection("users").add(newUser);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 🔹 User Login
 
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 🔹 Google Login
 
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "ID Token is required!" });

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    let userId;
    if (snapshot.empty) {
      // If user doesn't exist, create a new user
      const newUser = { email, name, profileImage: picture || "", createdAt: new Date(), provider: "google" };
      const userDoc = await db.collection("users").add(newUser);
      userId = userDoc.id;
    } else {
      userId = snapshot.docs[0].id;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    // Store refresh token in Firestore
    await db.collection("refreshTokens").doc(userId).set({ token: refreshToken });

    res.status(200).json({ message: "Google login successful!", accessToken, refreshToken, userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate user!" });
  }
});

// 🔹 Refresh Token Endpoint
 
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const tokenDoc = await db.collection("refreshTokens").where("token", "==", refreshToken).get();
    if (tokenDoc.empty) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔹 Logout (Invalidate Refresh Token)
 
router.post("/logout", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await db.collection("refreshTokens").doc(userId).delete();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");
const admin = require("firebase-admin"); // Firebase Admin SDK

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";


 // 🔹 Generate Access & Refresh Tokens
 
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Short-lived
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived
  return { accessToken, refreshToken };
};

// 🔹 User Registration
 
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (!snapshot.empty) return res.status(400).json({ error: "User already exists" });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in Firestore
      const newUser = {
        email,
        password: hashedPassword,
        name,
        createdAt: new Date()
      };

      const userDoc = await db.collection("users").add(newUser);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//🔹 User Login

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// 🔹 Google Login
 
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body; // Get Firebase ID token from frontend

    if (!idToken) {
      return res.status(400).json({ error: "ID Token is required!" });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // If user doesn't exist, create a new user in Firestore
      await userRef.set({
        email,
        name,
        profileImage: picture || "",
        createdAt: new Date().toISOString(),
        provider: "google",
      });
    }

    // Generate JWT access token
    const accessToken = jwt.sign({ userId: uid }, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

    return res.status(200).json({ message: "Login successful!", accessToken, userId: uid });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Failed to authenticate user!" });
  }
});

// 🔹 Refresh Token Endpoint
 
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const tokenDoc = await db.collection("refreshTokens").where("token", "==", refreshToken).get();
    if (tokenDoc.empty) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//🔹 Logout (Invalidate Refresh Token)
 
router.post("/logout", verifyToken, async (req, res) => {
  try {
    await db.collection("refreshTokens").doc(req.user.userId).delete();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// 🔹 Generate Access & Refresh Tokens
 
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Short-lived
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived
  return { accessToken, refreshToken };
};

// 🔹 User Registration
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, name } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (!snapshot.empty) return res.status(400).json({ error: "User already exists" });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user in Firestore
      const newUser = {
        email,
        password: hashedPassword,
        name,
        createdAt: new Date()
      };

      const userDoc = await db.collection("users").add(newUser);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.status(201).json({ message: "User registered successfully", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//🔹 User Login
 
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


 // 🔹 Refresh Token Endpoint

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const tokenDoc = await db.collection("refreshTokens").where("token", "==", refreshToken).get();
    if (tokenDoc.empty) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // 🔹 Logout (Invalidate Refresh Token)
 
router.post("/logout", verifyToken, async (req, res) => {
  try {
    await db.collection("refreshTokens").doc(req.user.userId).delete();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

// Generate Access & Refresh Tokens
 
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" }); // Short-lived
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // Long-lived
  return { accessToken, refreshToken };
};


 // User Login
 
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.where("email", "==", email).get();

      if (snapshot.empty) return res.status(400).json({ error: "Invalid credentials" });

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (!passwordMatch) return res.status(400).json({ error: "Invalid credentials" });

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userDoc.id);

      // Store refresh token in Firestore
      await db.collection("refreshTokens").doc(userDoc.id).set({ token: refreshToken });

      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Refresh Token Endpoint
 
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const tokenDoc = await db.collection("refreshTokens").where("token", "==", refreshToken).get();
    if (tokenDoc.empty) return res.status(403).json({ error: "Invalid refresh token" });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token" });

      const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (Invalidate Refresh Token)
router.post("/logout", verifyToken, async (req, res) => {
  try {
    await db.collection("refreshTokens").doc(req.user.userId).delete();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth, db } = require("../config/firebase");

const router = express.Router();

// Signup Route
router.post(
  ["/signup", "/register"],
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      const userRecord = await auth.createUser({ email, password, displayName: name });

      await db.collection("users").doc(userRecord.uid).set({
        name,
        email,
        createdAt: new Date(),
      });

      const token = jwt.sign({ userId: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ message: "User created successfully", userId: userRecord.uid, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const userQuery = await db.collection("users").where("email", "==", email).get();
      if (userQuery.empty) return res.status(400).json({ error: "User not found" });

      const userData = userQuery.docs[0].data();
      const userId = userQuery.docs[0].id;

      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user: { id: userId, name: userData.name, email: userData.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Password Reset
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const link = await auth.generatePasswordResetLink(email);
    res.json({ message: "Password reset link sent", resetLink: link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/*const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth, db } = require("../config/firebase");

const router = express.Router();

// Signup Route
router.post(
  ["/signup", "/register"],
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      const userRecord = await auth.createUser({ email, password, displayName: name });

      await db.collection("users").doc(userRecord.uid).set({
        name,
        email,
        createdAt: new Date(),
      });

      const token = jwt.sign({ userId: userRecord.uid }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const userQuery = await db.collection("users").where("email", "==", email).get();
      if (userQuery.empty) return res.status(400).json({ error: "User not found" });

      const userData = userQuery.docs[0].data();
      const userId = userQuery.docs[0].id;

      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user: { id: userId, name: userData.name, email: userData.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Password Reset
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const link = await auth.generatePasswordResetLink(email);
    res.json({ message: "Password reset link sent", resetLink: link });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth, db } = require("../config/firebase");

const router = express.Router();

// Signup Route
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      const userRecord = await auth.createUser({ email, password, displayName: name });

      await db.collection("users").doc(userRecord.uid).set({
        name,
        email,
        createdAt: new Date(),
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const userQuery = await db.collection("users").where("email", "==", email).get();
      if (userQuery.empty) return res.status(400).json({ error: "User not found" });

      const userData = userQuery.docs[0].data();
      const userId = userQuery.docs[0].id;

      const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user: { id: userId, name: userData.name, email: userData.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Password Reset
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    await auth.generatePasswordResetLink(email);
    res.json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; */


