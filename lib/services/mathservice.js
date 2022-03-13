'use strict';

const Schmervice = require('@hapipal/schmervice');

module.exports = class mathService extends Schmervice.Service {

    async create(){
        
        return "tested service"
    }
}
