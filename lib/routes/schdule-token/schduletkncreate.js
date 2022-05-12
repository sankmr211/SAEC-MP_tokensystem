'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/schduletoken/create',
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                Start_time:Joi.string().required(),
                End_time:Joi.string().required(),
                token_uid:Joi.string().required(),
                count:Joi.number().required(),
                active:Joi.boolean().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {scheduleserivce}=request.services();
            var res= await scheduleserivce.create(db,request.payload)
            if(res.statusCode==200){
                return h.response(res).code(201)
            }else{
                return res
            }
        } catch (err) {
            console.log(err);
            const res = h.response(err);
            res.code(500);
            return res;
        }
    }
});