const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    isactive: {
        type: Boolean,
        required: true,
        default: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    userid: {
        type: Schema.Types.ObjectId,  ref: 'User', required: true
    }
})

module.exports = mongoose.model('ForgotPasswordRequest', ForgotPasswordSchema);    




// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const forgotpswd = sequelize.define('ForgotPasswordRequest', {
//   id: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     primaryKey: true
//   },
//   isactive: {
//     type: Sequelize.BOOLEAN
//   }
// });

// module.exports = forgotpswd;