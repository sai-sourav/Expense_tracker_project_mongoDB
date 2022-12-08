const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');

const userroute = require('./routes/userroute');
const expenseroute = require('./routes/expensesroute');
const razorpayroute = require('./routes/payment');

const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/premiumorder');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(razorpayroute);

app.use(userroute);

app.use(expenseroute);

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);


User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

sequelize
.sync()
// .sync( {force : true} )
.then( result => {
    app.listen(4000);
})