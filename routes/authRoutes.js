import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Temporary in-memory storage for users (replace with MongoDB in production)
let users = [];

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ SIGNUP - Register a new admin/user
router.post("/admin", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    // Check if username or email already exists
    const existingUser = users.find((u) => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, username, email },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ VALIDATE TOKEN
router.get("/validate", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "Token valid", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

// ✅ REFRESH TOKEN
router.post("/refresh-token", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, username: decoded.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Token refreshed", token: newToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
});

// ✅ CHECK ROLE
router.post("/checkRole/:username", (req, res) => {
  try {
    const { username } = req.params;
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Role check successful", role: "admin" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ HEALTH CHECK
router.post("/healthCheck", (req, res) => {
  res.status(200).json({ message: "Auth service is running" });
});

export default router;
