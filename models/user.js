const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ispremiumuser: {
        type: Boolean,
        required: true,
        default: false
    },
    forgotpswdrequests: [
        {
            requestid: { type: Schema.Types.ObjectId,  ref: 'ForgotPasswordRequest', required: true}
        }
    ],
    credits: [
        {
            creditid: { type: Schema.Types.ObjectId,  ref: 'Credit', required: true}
        }
    ],
    debits: [
        {
            debitid: { type: Schema.Types.ObjectId,  ref: 'Debit', required: true}
        }
    ],
    orders: [
        {
            orderid: { type: Schema.Types.ObjectId,  ref: 'Order', required: true}
        }
    ],
    fileurl: [
        {
            fileurlid: { type: Schema.Types.ObjectId,  ref: 'Fileurl', required: true}
        }
    ]
})

module.exports = mongoose.model('User', UserSchema);    




// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const User = sequelize.define('user', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   emailid: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   ispremiumuser: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
//   }
// });

// module.exports = User;