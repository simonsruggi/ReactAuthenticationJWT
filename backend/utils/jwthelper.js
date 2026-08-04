const jwt = require("jsonwebtoken");

// Il segreto non deve MAI stare nel codice: chiunque legga il repository
// potrebbe firmare token validi. Va letto dall'ambiente (vedi .env.example).
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error(
    "JWT_SECRET is not set. Copy backend/.env.example to backend/.env and set a long random value."
  );
}

// I token devono scadere: senza expiresIn un token rubato resta valido per
// sempre e non esiste modo di invalidarlo.
const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "1h";

const generateToken = (user) => {
  return jwt.sign({ userId: user._id.toString() }, SECRET_KEY, {
    expiresIn: TOKEN_TTL,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken, TOKEN_TTL };
