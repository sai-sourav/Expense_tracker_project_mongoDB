const express = require('express');
// const helmet = require("helmet");
const morgan = require('morgan');
const https = require('https');
const app = express();
const fs = require('fs');

const dotenv = require('dotenv');
dotenv.config();

const bodyparser = require('body-parser');
const Cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');

const userroute = require('./routes/userroute');
const expenseroute = require('./routes/expensesroute');
const razorpayroute = require('./routes/payment');
const creditsroute = require('./routes/creditsroute');

const User = require('./models/user');
const Expense = require('./models/expenses');
const Order = require('./models/premiumorder');
const Forgotpswd = require('./models/forgotpswd');
const Credit = require('./models/credits');
const Fileurl = require('./models/fileurl');

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);


app.use(morgan('combined', { stream: accessLogStream }));

// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         scriptSrc: ["'self'", "https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"]
//       }
//     })
// );
app.use(Cors());
// app.use(helmet());
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
// );
// app.use(
//     helmet.contentSecurityPolicy({
//         useDefaults: false,                    
//         directives: {
//              'default-src': ['\'unsafe-inline\'', '\'self\'', 'https://*', 'http://*', '\'unsafe-eval\'', '*'],
//              'script-src': ['\'self\'', 'unsafe-inline', '\'unsafe-eval\'', '*', 'http', 'https'],
//              'img-src': ['\'self\'', 'http://*', 'https://*', 'https://cdn.discordapp.com'],
//              'frame-src': [ 'http://*']
//          },
//     }),
//     helmet.referrerPolicy({
//         policy: ["origin", "unsafe-url"],
//       }),
//     helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }),
//     helmet.crossOriginResourcePolicy({ policy: "same-origin" }),
//     helmet.crossOriginOpenerPolicy({ policy: "same-origin" })
//  );

//  app.use(
//     helmet.permittedCrossDomainPolicies({
//       permittedPolicies: "all",
//     })
//   );


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

Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Expense);

Credit.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Credit);

Fileurl.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Fileurl);

Forgotpswd.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Forgotpswd);

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

sequelize
.sync()
// .sync( {force : true} )
.then( result => {
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 4000);
    app.listen(process.env.PORT || 4000);
})