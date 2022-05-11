'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var user = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    user_uid: {
        type: String,
        required: true,
        index: true
    },
    activate_status:{
        type: Boolean,
        required: true,
    },
    user_type:{
        type:String,
        required:true
    },
    department_uid:{
        type:String
    },
    mobile_no:{
        type: Number,
        index: true,
        unique: true,
    },
    count:{
        type: Number
    }
    
},
   { timestamps: true })

   module.exports = {
    name: 'user',
    schema: user

}