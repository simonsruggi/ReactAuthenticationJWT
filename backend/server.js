// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Caricato dopo dotenv: jwthelper fallisce subito se JWT_SECRET manca,
// così l'errore emerge all'avvio e non alla prima login.
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Copy backend/.env.example to backend/.env first."
  );
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// cors() senza opzioni significa Access-Control-Allow-Origin: *, che su
// un'API di autenticazione lascia chiamare la login da qualunque sito.
// Si limita alle origini del frontend, configurabili via CORS_ORIGIN.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
});
