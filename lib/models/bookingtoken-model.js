// mongoose@"^5.12.4" not supported the autoincrement module
'use strict';
const { string } = require('@hapi/joi');
const mongoose = require('mongoose'),autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var connection = mongoose.createConnection(`${process.env.MODEL_DB_URL}`);
autoIncrement.initialize(connection);
var tokenbooking = new Schema({
    token_no: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },
    user_uid: {
        type: String,
        required: true
    },
    department_uid:{
        type:String
    },
    officer_uid:{
        type:String
    },
    schedule_starttime:{
        type: Date
    },
    schedule_endtime:{
        type: Date
    },
    status: {
        type: String,
        required: true,
        index: true
    },
    schdule_name:{
        type:String
    },
    schdule_uid:{
        type:String
    }

},
   { timestamps: true })
   tokenbooking.plugin(autoIncrement.plugin, {
    model: 'tokenbooking',
    field: 'token_no',
    startAt: 8000,
    incrementBy: 1
});
   module.exports = {
    name: 'tokenbooking',
    schema: tokenbooking

}