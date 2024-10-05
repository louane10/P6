const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Routes pour les livres
router.get('/', auth, bookController.getAllBooks);
router.get('/:id', auth, bookController.getOneBook);
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/', multer, bookController.createBook);
router.put('/:id', multer, bookController.updateBook);
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
