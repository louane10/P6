const sharp = require("sharp");
const fs = require("fs");

exports.compressImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const inputPath = req.file.path;
  const outputPath = req.file.path + ".webp";

  // Utilisation de Sharp pour redimensionner et compresser l'image
  sharp(inputPath)
    .webp({ quality: 70 })
    .toFile(outputPath, (err, info) => {
      if (err) {
        console.error(err);
        fs.unlink(inputPath);
        return res.status(500).json({ error: "Erreur" });
      }

      req.file.path = outputPath;

      fs.unlink(inputPath, (err) => {
        if (err) {
          console.error(err);
        }
        next();
      });
    });
};

module.exports = compressImage;
