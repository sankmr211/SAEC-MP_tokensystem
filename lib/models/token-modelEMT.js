'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var token = new Schema({
    name:{
        type: String,
        required: true
    },
    depart_name: {
        type: String,
        required: true
    },
    depart_id: {
        type: String,
        required: true
    },
    officer_name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
        index: true
    },
    token_uid:{
        type:String,
        unique: true
    },
    active:{type:Boolean,
        required: true
    }
},
   { timestamps: true })

   module.exports = {
    name: 'token',
    schema: token

}