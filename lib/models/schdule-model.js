'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var token_schdule = new Schema({
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
        required: true,
        index: true
    },
    user_id: {
        type: String,
        required: true
        
    },
    schedule_uid:{
        type:String,
        unique: true
    },
    Start_time:{
        type: Date
    },
    End_time:{
        type: Date
    },
    count:{
        type:'Number'
    },
    active:{type:Boolean,
        required: true
    }
    
},
   { timestamps: true })

   module.exports = {
    name: 'token_schdule',
    schema: token_schdule

}