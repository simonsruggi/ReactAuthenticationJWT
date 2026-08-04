const { verifyToken } = require("../utils/jwthelper");

// Senza questo middleware il token non viene mai verificato lato server e
// l'autenticazione resta puramente decorativa: chiunque chiami l'API
// direttamente accede senza credenziali.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    // TokenExpiredError va distinto: il client deve sapere che deve rifare login.
    const expired = err.name === "TokenExpiredError";
    return res.status(401).json({
      error: expired ? "Token expired." : "Invalid token.",
      expired,
    });
  }
}

module.exports = { requireAuth };
