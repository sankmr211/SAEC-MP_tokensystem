'use strict';
const Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var token_schdule = new Schema({
    name: {
        type: String
    },
    user_uid: {
        type: String
    },
    department_uid: {
        type: String
    },
        Start_time: {
        type: Date
    },
    End_time: {
        type: Date
    },
    schdule_uid: {
        type: String,
        unique: true
    },
    count: {
        type: 'Number'
    },
    remaining_count: {
        type: 'Number'
    },
    active: {
        type: Boolean,
    }
},
    { timestamps: true })

module.exports = {
    name: 'token_schdule',
    schema: token_schdule

}