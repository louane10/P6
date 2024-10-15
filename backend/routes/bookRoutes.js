const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');

// Routes pour les livres
router.get("/bestrating", bookController.getBestRatedBooks);
router.get('/:id', bookController.getOneBook);
router.get('/', bookController.getAllBooks);

router.post('/:id/rating', auth, bookController.rateBook);
router.post('/', auth, multer, bookController.createBook);

router.put('/:id', auth, multer, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
