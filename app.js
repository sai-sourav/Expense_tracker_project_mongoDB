const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Cors = require('cors');
const path = require('path');

const userroute = require('./routes/userroute');
const expenseroute = require('./routes/expensesroute');
const razorpayroute = require('./routes/payment');
const creditsroute = require('./routes/creditsroute');

// const User = require('./models/user');
// const Expense = require('./models/expenses');
// const Order = require('./models/premiumorder');
// const Forgotpswd = require('./models/forgotpswd');
// const Credit = require('./models/credits');
// const Fileurl = require('./models/fileurl');


app.use(Cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));



app.use(express.static(path.join(__dirname, 'public')));

app.use(razorpayroute);

app.use(userroute);

app.use(creditsroute);

app.use(expenseroute);

app.use((req, res, next) => {
    if(req.url === '/'){
        req.url = "html/signup.html";
    }
    res.sendFile(path.join(__dirname,`public/${req.url}`));
});

// Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Expense);

// Credit.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Credit);

// Fileurl.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Fileurl);

// Forgotpswd.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Forgotpswd);

// User.hasMany(Order);
// Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tdeqggk.mongodb.net/expense_tracker?retryWrites=true&w=majority`)
  .then(result => {
    console.log("connected to MongoDB!😎😎");
    app.listen(4000);
  }).catch(err => {
    console.log(err);
})

