const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.controller')


// Get Product List
router.get('/', ProductController.getAllProducts)

// Create Product
router.post('/', ProductController.createProduct)

// Get Product by id
router.get('/:id', ProductController.getProductById)

router.patch('/:id', ProductController.updateProduct)

router.delete('/:id', ProductController.deleteProduct)

module.exports = router;