const Order = require('../models/orders');
// Create Controll to Order get all data
exports.orders_get_all = function(req, res){
    Order.find()
    .select('_id product quantity')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                    return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'http://localhsot:3000/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

// Create Controll to Order inserting data.
exports.orders_create_order = function(req, res){
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
    .then(function(result){
        res.status(201).json({
            message: "Product was ordered!.",
            order: result 
        });
    })
    .catch(function(err){
        res.status(500).json({
            error: err  
        });
    });  
}

// Create Controll to Order finding by  ID.
exports.orders_findById = function(req, res){
    res.status(200).json({
        message: "It worked!."
    });
}

// Create Controll to Order updating by ID.
exports.orders_patch = function(req, res){
    res.status(200).json({
        message: "It worked!."
    });
}

// Create Controll to Order updating by ID.
exports.orders_delete = function(req, res){
    res.status(200).json({
        message: "It worked!."
    });
}
