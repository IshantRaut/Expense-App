const User = require('../models/users');
const Expense = require('../models/expenses');

exports.leaderboard = (req,res,next)=>{
    User.findAll({
        //inserting Expense table in to Users table
        include:{
            model:Expense,
            group:User.name,
            attributes:['amount'],
     }})
    .then(data => {
        console.log(JSON.stringify(data));
        let result=[];
        data.forEach(element => {
            let sum=0;
            //this forEach loop is to loop through the expenses of current user and sum it up
            element.expenses.forEach(expense=>{
            sum=sum+expense.amount;
            })

            let obj = {
                name:element.name,
                total:sum
            }
            result.push(obj);
        });

        res.status(201).json(result.sort((a,b)=>b.total-a.total));})

    .catch(err=>res.status(400).json({message:"unable to fetch leaderboard data",error:err}))
} 