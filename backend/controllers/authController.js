const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenUtil");
const { db } = require("../config/db"); // Firestore database
const admin = require("../config/firebase"); // Firebase Admin SDK

// ✅ User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Store user in Firestore
    const userDoc = await db.collection("users").add(newUser);
    
    // Generate token
    const token = generateToken(userDoc.id);

    res.status(201).json({ message: "User registered successfully!", token, userId: userDoc.id });
  } catch (error) {
    res.status(500).json({ error: "Registration failed!" });
  }
};

// ✅ User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    // Get user data
    let userData;
    let userId;
    snapshot.forEach((doc) => {
      userData = doc.data();
      userId = doc.id;
    });

    // Verify password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    // Generate token
    const token = generateToken(userId);

    res.json({ message: "Login successful!", token, userId });
  } catch (error) {
    res.status(500).json({ error: "Login failed!" });
  }
};

// ✅ Google Login
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body; // Firebase ID Token from frontend

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    // Check if user exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    let userId;
    if (snapshot.empty) {
      // Create new user if not found
      const newUser = {
        name,
        email,
        googleUid: uid,
        profilePicture: picture,
        createdAt: new Date().toISOString(),
      };
      const userDoc = await db.collection("users").add(newUser);
      userId = userDoc.id;
    } else {
      userId = snapshot.docs[0].id;
    }

    // Generate JWT token for session
    const token = generateToken(userId);

    res.json({ message: "Google login successful!", token, userId });
  } catch (error) {
    res.status(500).json({ error: "Google login failed!" });
  }
};

module.exports = { registerUser, loginUser, googleLogin };


/*const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenUtil");
const { db } = require("../config/db"); // Firestore database

// ✅ User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Store user in Firestore
    const userDoc = await db.collection("users").add(newUser);
    
    // Generate token
    const token = generateToken(userDoc.id);

    res.status(201).json({ message: "User registered successfully!", token, userId: userDoc.id });
  } catch (error) {
    res.status(500).json({ error: "Registration failed!" });
  }
};

// ✅ User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userRef = db.collection("users").where("email", "==", email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    // Get user data
    let userData;
    let userId;
    snapshot.forEach((doc) => {
      userData = doc.data();
      userId = doc.id;
    });

    // Verify password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }

    // Generate token
    const token = generateToken(userId);

    res.json({ message: "Login successful!", token, userId });
  } catch (error) {
    res.status(500).json({ error: "Login failed!" });
  }
};

module.exports = { registerUser, loginUser };
*/
