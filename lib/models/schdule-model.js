'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var token_schdule = new Schema({
    name: {
        type: String,
        required: true
    },
    user_uid:{
        type: String,
        required: true
    },
    department_uid:{type: String,
        required: true},
    Start_time:{
        type: Date
    },
    End_time:{
        type: Date
    },
    schdule_uid:{
        type:String,
        required: true,
        unique: true
    },
    count:{
        type:'Number'
    },
    remaining_count:{
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