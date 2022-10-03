const jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        var decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        next();
      } catch(err) {
        return res.status(401).json({
            message: "Auth failed."
        });
      }
};