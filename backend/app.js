const express = require("express");
const mongoose = require("mongoose");

const booksRoutes = require("./routes/bookRoutes");
const authRoutes = require("./routes/authRoutes");

const path = require("path");
const app = express();

// Connexion à MongoDB
require("dotenv").config();
mongoose
  .connect(process.env.BDD)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

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
