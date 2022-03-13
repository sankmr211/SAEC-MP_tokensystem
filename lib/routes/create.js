'use strict';

const Joi = require('@hapi/joi');


module.exports = {
    method: 'post',
    path: '/samplecreate',
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().min(2).required()
            })
        },
    },
    handler: async (request, h) => {
       try{
        var db = request.server.settings.app.getDatabaseConnection();
        const { Dog } = request.server.app.models;
        const { mathService } =  request.services();
        console.log(await mathService.create());
      return  "success"
       }
       catch(err){
        console.log(err);
        const res = h.response(err);
        res.code(500);
        return res;
       }
    }
};
