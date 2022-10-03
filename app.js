const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbUrl = 'mongodb+srv://mode-rest-shop:1BihyjC7nOd83m1n@cluster0-arzqg.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use ('/assets/userfiles', express.static('assets/userfiles') );
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.status(200).json({});
    } 
    next();
});

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
app.use('/products', productRoutes); 
app.use('/orders', orderRoutes); 
app.use('/user', userRoutes); 
app.use(function(req, res, next){
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use(function( error, req, res, next ){
    res.status( error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;