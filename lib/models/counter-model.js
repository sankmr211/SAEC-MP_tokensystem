'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var counter = new Schema({
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
    counter_uid: {
        type: String,
        required: true,
        index: true
    }
},
   { timestamps: true })

   module.exports = {
    name: 'token_counter',
    schema: counter

}