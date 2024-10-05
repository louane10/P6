const express = require("express");
const mongoose = require("mongoose");
const Book = require("./controllers/bookController");
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://louaneaugsburger:test@grimoire.0tbqt.mongodb.net/?retryWrites=true&w=majority&appName=grimoire",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Route GET pour tester si le serveur fonctionne
app.get("/", (req, res) => {
  res.send("Le serveur fonctionne !");
});

// Route GET pour obtenir la liste des livres
app.get("/books", (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});

// Route POST pour ajouter un livre
app.post("/books", (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    rating: req.body.rating,
    imageUrl: req.body.imageUrl,
  });

  book
    .save()
    .then(() => res.status(201).json({ message: "Livre ajouté avec succès !" }))
    .catch((error) => res.status(400).json({ error }));
});

// Route GET pour obtenir un livre spécifique
app.get("/books/:id", (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
});

// Route PUT pour modifier un livre
app.put("/books/:id", (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Livre modifié avec succès !" })
    )
    .catch((error) => res.status(400).json({ error }));
});

// Route DELETE pour supprimer un livre
app.delete("/books/:id", (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Livre supprimé avec succès !" })
    )
    .catch((error) => res.status(400).json({ error }));
});

// Le serveur écoute sur le port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

const auth = require("./controllers/authController");
const router = express.Router();

// Route pour récupérer tous les livres (protégée)
router.get("/books", auth, (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});

// Autres routes protégées
router.post("/books", auth, (req, res) => {
  // Ajouter un livre
});
