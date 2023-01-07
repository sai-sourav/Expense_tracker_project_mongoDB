const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderid: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentid: {
        type: String
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

module.exports = mongoose.model('Order', OrderSchema);  













// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const Order = sequelize.define('order', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   orderid : {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   status : {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   paymentid : {
//     type: Sequelize.STRING
//   }
// });

// module.exports = Order;