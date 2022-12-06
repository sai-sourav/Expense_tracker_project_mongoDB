const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');

const userroute = require('./routes/userroute');

app.use(bodyparser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(userroute);

sequelize.sync()
.then( result => {
    app.listen(4000);
})