const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');


const sequelize = require('./util/database');

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(morgan('combined',{stream:accessLogStream}));
app.use(helmet());

//Tables
const usersTable= require('../Expense-App/models/user');
const expenseTable = require('../Expense-App/models/expense');
//routes
const userRoutes = require('../Expense-App/routes/userRoutes');
const expenseRoutes = require('../Expense-App/routes/expense');

app.use(userRoutes);
app.use(expenseRoutes);


usersTable.hasMany(expenseTable);
expenseTable.belongsTo(usersTable);

sequelize.sync( ) 
.then(result=>{

    //http.createServer({key:privateKey,cert:certificate},app)
    app.listen(process.env.PORT||3000);
})
.catch(err=>
    {console.log(err);
}) 