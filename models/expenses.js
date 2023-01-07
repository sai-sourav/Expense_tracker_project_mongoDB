const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DebitSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
    
})

module.exports = mongoose.model('Debit', DebitSchema);  



// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Expense = sequelize.define('expense', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     amount: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     Description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     category: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Expense;