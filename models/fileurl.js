const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileurlSchema = new Schema({
    fileurl: {
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

module.exports = mongoose.model('Fileurl', FileurlSchema);  





// const sequelize = require('../util/database');
// const Sequelize = require('sequelize');

// const fileurl = sequelize.define('fileurl', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     fileurl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     }
// })

// module.exports = fileurl;