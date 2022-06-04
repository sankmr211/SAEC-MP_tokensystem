'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var token_tran = new Schema({
    tran_uid: {
        type: String,
        unique:true
    },
    schedulename: {
        type: String,
    },
    schdule_uid: {
        type: String,
    },
    user_uid: {
        type: String,
        required: true,
        index: true
    },
    token_no: {
        type: Number,
        unique:true
    },
    department_uid: {
        type: String,
        required: true
    },
    time: {
        type: Date
    },
    officer_uid:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    mobile_no:{
        type:Number
    },
    schdule_startend:{
        type:String
    }
},
    { timestamps: true })

module.exports = {
    name: 'token_tran',
    schema: token_tran

}