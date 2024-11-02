const Book = require("../models/book");
const sharp = require("sharp");
const fs = require("fs");

// Contrôleur pour récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Contrôleur pour récupérer un livre
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Contrôleur pour créer un livre
exports.createBook = async (req, res) => {
  try {
    const bookData = JSON.parse(req.body.book);
    delete bookData._id;
    delete bookData._userId;
    const book = new Book({
      ...bookData,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }.webp`,
    });
    await book.save();
    res.status(201).json({ message: "Book created successfully!" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Contrôleur pour mettre à jour un livre
exports.updateBook = async (req, res, next) => {
  try {
    const bookData = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}.webp`,
        }
      : { ...req.body };
    delete bookData._userId;
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    // Suppression de l'ancienne image si une nouvelle image est téléchargée
    if (req.file && book.imageUrl) {
      const filename = book.imageUrl.split("/images/")[1];
      const fs = require("fs");
      if (filename) {
        fs.unlinkSync(`images/${filename}`);
      }
    }
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookData, _id: req.params.id }
    );
    res.status(200).json({ message: "Objet modifié!" });
  } catch (error) {
    console.error("Erreur dans la modification du livre:", error);
    res.status(500).json({ error });
  }
};

// Contrôleur pour supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: "403: unauthorized request" });
      }
      // Récupération du nom de l'image et suppression de l'image associée
      const filename = book.imageUrl ? book.imageUrl.split("/images/")[1] : null;
      const fs = require("fs");
      if (filename) {
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression de l'image:", err);
            return res.status(500).json({ error: "Erreur lors de la suppression de l'image" });
          }
          // Suppression du livre après suppression de l'image
          Book.deleteOne({ _id: req.params.id, userId: req.auth.userId })
            .then(() => res.status(200).json({ message: "Livre supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        // Suppression du livre directement si pas d'image associée
        Book.deleteOne({ _id: req.params.id, userId: req.auth.userId })
          .then(() => res.status(200).json({ message: "Livre supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.rateBook = async (req, res) => {
  try {
    const { userId, rating } = req.body;

    // Vérifier que la note est valide (entre 1 et 5)
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être entre 1 et 5." });
    }

    // Rechercher le livre par son ID
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find(
      (rating) => rating.userId === userId
    );
    if (existingRating) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    // Ajouter la nouvelle note
    book.ratings.push({ userId, grade: rating, bookId: book._id });

    // Recalculer la moyenne des notes
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce(
      (acc, rating) => acc + rating.grade,
      0
    );
    book.averageRating = sumRatings / totalRatings;

    // Sauvegarder les modifications
    await book.save();

    res.status(200).json({
      message: "Votre note a été ajoutée.",
      averageRating: book.averageRating,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find();
    const bestRatedBooks = books
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);

    res.status(200).json(bestRatedBooks);
  } catch (error) {
    res.status(500).json({ error });
  }
};
