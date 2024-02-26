const expense = require('../models/expenses');
const Expense = require('../models/expenses');
const User = require('../models/users')

exports.postAddExpense=async (req,res,next)=>{
 await Expense.create({
    amount:req.body.amount,
    description:req.body.description,
    category: req.body.category
 })
 .then(result=> res.json(result.dataValues.id))
 .catch(err => console.log(err));
}


exports.getDeleteExpense=async(req,res,next)=>{
    const id = req.params.id;
    Expense.findByPk(id)
    .then(data=>{
        data.destroy();
        res.json(data);
    })
}


exports.getAllData = async(req,res,next)=>{
    const userId = req.body.userId
    Expense.findAll({where:{userId:userId}})
    .then(data=>{
        res.json(data)
    });
}