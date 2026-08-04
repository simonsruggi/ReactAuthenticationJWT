const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwthelper");
const { requireAuth } = require("../middleware/auth");

const MIN_PASSWORD_LENGTH = 8;

// express.json() accetta qualsiasi JSON, quindi req.body.username può essere
// un oggetto come {"$ne": null} e finire dritto in una query Mongo.
// Verificare il tipo è ciò che impedisce la NoSQL injection.
function readCredentials(body) {
  const { username, password } = body || {};
  if (typeof username !== "string" || typeof password !== "string") {
    return { error: "Username and password must be strings." };
  }
  const trimmed = username.trim();
  if (!trimmed || !password) {
    return { error: "Username and password are required." };
  }
  return { username: trimmed, password };
}

router.post("/login", async (req, res) => {
  const creds = readCredentials(req.body);
  if (creds.error) return res.status(400).json({ error: creds.error });

  const user = await User.findOne({ username: creds.username });

  // Stesso messaggio in entrambi i casi: non riveliamo se l'utente esiste.
  if (!user) return res.status(400).json({ error: "Invalid username or password." });

  const validPassword = await bcrypt.compare(creds.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Invalid username or password." });

  res.json({ token: generateToken(user) });
});

router.post("/register", async (req, res) => {
  try {
    const creds = readCredentials(req.body);
    if (creds.error) return res.status(400).json({ error: creds.error });

    if (creds.password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const existingUser = await User.findOne({ username: creds.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(creds.password, salt);

    const savedUser = await new User({
      username: creds.username,
      password: hashedPassword,
    }).save();

    res.json({
      message: "User registered successfully",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rotta protetta: mostra come si verifica il token lato server.
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.userId).select("username");
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ userId: user._id, username: user.username });
});

module.exports = router;
