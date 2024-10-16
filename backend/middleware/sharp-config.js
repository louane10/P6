const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const imagePath = path.join(__dirname, "../images/", req.file.filename);

  try {
    // Utilisation de Sharp pour redimensionner et compresser l'image
    await sharp(req.file.path)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(imagePath);

    // Supprimer l'ancienne image non compressée
    fs.unlinkSync(req.file.path);

    req.file.path = imagePath;
    next();
  } catch (error) {
    console.error("Erreur lors de la compression de l'image :", error);
    res.status(500).json({ message: "Erreur lors du traitement de l'image" });
  }
};
