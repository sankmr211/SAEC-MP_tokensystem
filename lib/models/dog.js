'use strict';



const Mongoose = require('mongoose');

module.exports = {
    name: 'Dog',
    schema: new Mongoose.Schema({
        name: String
    })
};
