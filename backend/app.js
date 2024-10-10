const express = require("express");
const mongoose = require("mongoose");

const booksRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

const path = require("path");
const app = express();

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://louaneaugsburger:test@grimoire.0tbqt.mongodb.net/?retryWrites=true&w=majority&appName=grimoire"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;