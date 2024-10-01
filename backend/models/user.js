const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Schéma utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Appliquer le validateur d'unicité
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
