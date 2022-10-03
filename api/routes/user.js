const express = require('express');
const route = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

route.post('/login', function(req, res, next){
    User.find({ email: req.body.email })
    .then(function(user){
        if( user.length < 1 ){
            return res.status(401).json({
                message: "Email is not match."
            });
        }
        bcrypt.hash(req.body.password, user[0].password, function(err, result){
            if(err){
                return res.status(401).json({
                    message: "Password is not match."
                });
            }
            if(result){
                const token = jwt.sign(
                    { 
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    'secret', 
                    { 
                        expiresIn: 60 * 60 
                    }
                );

                return res.status(200).json({
                    message: "Auth loged in succesful.",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed."
            });
        });
        
    }) 
    .catch(function(err){
        res.status(500).json({
            error: err  
        });
    }); 
});

route.post('/signup', function(req, res, next){
    User.find({ email: req.body.email })
    .then(function(user){
        if( user.length >= 1 ){
            return res.status(409).json({
                message: "Mail exists."
            });
        }else{
            bcrypt.hash(req.body.email, 10, function(err, hash){
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(function(result){
                        res.status(201).json({
                            message: "User was created!.",
                            user: result 
                        });
                    })
                    .catch(function(err){
                        res.status(500).json({
                            error: err  
                        });
                    }); 
                }
            });
        }
    });
});

route.get('/', function(req, res, next){
    User.find()
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                    return{
                    _id: doc._id,
                    email: doc.email,
                    password: doc.password
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}); 

module.exports = route;