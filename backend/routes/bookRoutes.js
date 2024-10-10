const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/authMiddleware');
const multer = require('../middleware/multer-config');

// Routes pour les livres
router.get('/', auth, bookController.getAllBooks);
router.get('/:id', auth, bookController.getOneBook);
//router.get("/bestrating", booksCtrl.getBestRatedBooks);

router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);

router.put('/:id', auth, multer, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;
