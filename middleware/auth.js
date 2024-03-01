const jwt = require('jsonwebtoken');
// const User = require('../models/user');

exports.authenticate=(req,res,next)=>{
    try{
        const token = req.header("Authorization");
        const User = jwt.verify(token,"g98yigujkggggu98gyu");
        req.body.userId = User.userId;
        next();
    }
    catch{err=>{console.log(err)}}
}