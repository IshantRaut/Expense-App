const express = require('express');
const app = express();
const bodyParser  = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');


const sequelize = require('./util/database');



//Tables
const usersTable= require('./models/user');
const expenseTable = require('./models/expense');
const orderTable=require('./models/order');
const passwordRequestTable=require('./models/forgotPasswordReq');
const downloadTable = require('./models/download');

//routes
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premium = require('./routes/premium');
const passwordReset = require('./routes/password');
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(helmet());

app.use(userRoutes);
app.use(expenseRoutes);
app.use('/premium',premium);
app.use('/purchase',purchaseRoutes);
app.use('/password',passwordReset);


usersTable.hasMany(expenseTable);
expenseTable.belongsTo(usersTable);
usersTable.hasMany(orderTable);
orderTable.belongsTo(usersTable);

usersTable.hasMany(passwordRequestTable);
passwordRequestTable.belongsTo(usersTable);
usersTable.hasMany(downloadTable);
downloadTable.belongsTo(usersTable);

sequelize.sync( ) 
.then(result=>{

    //http.createServer({key:privateKey,cert:certificate},app)
    app.listen(process.env.PORT||3000);
})
.catch(err=>
    {console.log(err);
}) 