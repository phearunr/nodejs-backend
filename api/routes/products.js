const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const authCheck = require('../middleware/check-auth');
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './assets/userfiles/');
    },
    filename: function( req, file, callback ){
        callback(null, new Date().toISOString() +'_'+ file.originalname);
    }
});

const fileFilter = function( req, file, callback ){
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        callback(null, true);
    }else{
    callback(null, false);
    }
}

const upload = multer({ 
    storage: storage,
    limits: { fieldSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});

// Hangling incoming GET requests / products.
route.get('/', function(req, res, next){
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then( function(docs){
        const respone = {
            count: docs.length,
            products: docs.map(
                function(doc){
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3003/products/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(respone)
    })
    .catch(function(err){
        error:err
    });
}); 

// Hangling incoming POST requests / products.
route.post('/', upload.single('productImage'),authCheck ,function(req, res, next){
    console.log(req.file);
    const product = new Product({
        "_id": mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then(function(result){
        res.status(201).json({
            message: "Created product successfully!."  ,
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id
                }
            } 
        });
    })
    .catch(function(err){
        res.status(500).json({
            error:err
        })
    });
});

// Hangling incoming GET method throw parameter requests / products.
route.get('/:productId', function(req, res, next){
    const id = req.params.productId;
    Product.findById(id)
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    });
}); 

// Hangling incoming PATCH throw parameter requests / products.
route.patch('/:productId', function(req, res){
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(function(result){
        res.status(200).json(result);
    })
    .catch(function(err){
        res.status(500).json({
            error: err
        });
    });
});

// Hangling incoming DELECT throw requests / products.
route.delete('/:productId', function(req, res){
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(function(result){
        res.status(200).json(result);
    })
    .catch(function(err){
        res.status(200).json({
            error: err
        })
    });
});

module.exports = route;