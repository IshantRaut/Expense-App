const Razorpay = require('razorpay');
const Order = require('../models/order');
const Users = require('../models/user');
const crypto = require("crypto");
require('dotenv').config();

exports.createOrder = async(req,res)=>{
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        const options={
            amount : 50000,
            currency:"INR" 
        }

        //creating the order using rzrpay methods
        instance.orders.create(options,(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }  

            //creating and storing the data in orders table
            Order.create({orderid:order.id, status:'PENDING',userId : req.body.userId})
            .then(()=> {return res.status(201).json({orderid:order.id,  key_id:instance.key_id,  currency:order.currency,  amount:order.amount});})
            .catch(err=>{
                throw new Error(err)
            })
        });
    }
    catch(err){
        console.log(err);
        res.status(403).json({message:'Something went wrong',error:err})
    }
}


//1. updating the payment status (failed or successful)
//2. storing the payment id in database
exports.checkOut = async(req,res)=>{
    const{payment_id,status,userId} = req.body;
    let premiumStatus = false;
    if(status=="successful"){premiumStatus=true}

    //we always update the last transaction done by user, i.e why first we order the data in desc order
    const order = await Order.findOne({order: [[ 'id', 'DESC' ]]},{where:{userId:userId}}); 

    const promise1 = Order.update({paymentid: payment_id, status:status},{where:{id:order.id}});
    const promise2 = Users.update({isPremium:premiumStatus},{where:{id:userId}});

    Promise.all([promise1,promise2]).then(res.json({status:status}));
}