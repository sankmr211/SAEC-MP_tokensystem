'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/token/schduletoken/update/{id}',
    options: {
        validate: {
            params: Joi.object({
                id:Joi.string().required()
            }),
            payload: Joi.object({
                name: Joi.string().required(),
                user_uid: Joi.string().required(),
                department_uid: Joi.string().required(),
                Start_time:Joi.string().required(),
                End_time:Joi.string().required(),
                count:Joi.number().required(),
                remaining_count:Joi.number().required(),
                active:Joi.boolean().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {scheduleserivce}=request.services();
            var res= await scheduleserivce.update(db,request.params,request.payload)
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