'use strict';
const Mongoose = require('mongoose')
var Schema = Mongoose.Schema;
var tokenlive = new Schema({
    schdule_uid:{
        type:String
    },
    token_no: {
        type: Array,
        default:[]
    }
},
   { timestamps: true })
   module.exports = {
    name: 'tokenlive',
    schema: tokenlive

}