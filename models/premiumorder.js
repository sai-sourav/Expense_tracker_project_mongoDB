const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  orderid : {
    type: Sequelize.STRING,
    allowNull: false,
  },
  status : {
    type: Sequelize.STRING,
    allowNull: false
  },
  paymentid : {
    type: Sequelize.STRING
  }
  // signature : {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  // }
});

module.exports = Order;