const Product = require('../models/product.model');
const mongoose = require('mongoose');
const createError = require('http-errors');


module.exports = {
    getAllProducts:async (req, res, next) => {
        try {
            const result = await Product.find({}, { __v: 0 });
            // const result = await Product.find({}, {name:1, price:1});
            // const result = await Product.find({price:6999}, {});
    
            res.send(result);
        } catch (error) {
            console.log(error.message)
        }
    
    },

    createProduct:async (req, res, next) => {
        try {
            const product = new Product(req.body);
            const result = await product.save();
            res.send(result)
            console.log(result)
    
        } catch (error) {
            if (error.name == 'ValidationError') { 
                next(createError(422, error.message));
                return;
            }
            next(error)
        }
    },

    getProductById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await Product.findById(id);
            console.log(result);
            if (!result) {
                throw createError(404, 'This product does not exist');
            }
            res.send(result);
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid Product Id'))
                return;
            }
            console.log(error.message);
            next(error);
        }
    },

    updateProduct:async (req, res, next) => {
        try {
            const id = req.params.id;
            const update = req.body;
            const options = { new: true }
            const result = await Product.findByIdAndUpdate(id, update, options);
            res.send(result);
        } catch (error) {
            console.log(error.message)
        }
    },

    deleteProduct: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await Product.findByIdAndDelete(id);
            if (!result) {
                throw createError(404, 'Product does not exist')
            }
            res.send(result);
        } catch (error) {
            console.log(error.message);
            next(error)
        }
    }
}