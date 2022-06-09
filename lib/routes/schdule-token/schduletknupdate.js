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
                name: Joi.string().optional(),
                user_uid: Joi.string().optional(),
                department_uid: Joi.string().optional(),
                Start_time:Joi.string().optional(),
                End_time:Joi.string().optional(),
                count:Joi.number().optional(),
                remaining_count:Joi.number().optional(),
                active:Joi.boolean().optional()
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