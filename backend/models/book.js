const mongoose = require('mongoose');

// Définir le schéma du livre
const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  imageUrl: { type: String, required: true }
});

// Exporter le modèle
module.exports = mongoose.model('Book', bookSchema);
