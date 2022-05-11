'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var depart = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        index: true
    },
    department_uid: {
        type: String,
        required: true,
        index: true
    }
},
   { timestamps: true })

   module.exports = {
    name: 'token_deparment',
    schema: depart

}