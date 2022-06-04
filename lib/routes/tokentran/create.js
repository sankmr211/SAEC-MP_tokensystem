'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/tokentran/create',
    options: {
        validate: {
            payload: Joi.object({
                schedulename: Joi.string().required(),
                schdule_uid:Joi.string().required(),
                user_uid: Joi.string().required(),
                token_no:Joi.number().required(),
                department_uid:Joi.string().required(),
                time:Joi.string().required(),
                mobile_no:Joi.number().required(),
                status:Joi.string().required(),
                officer_uid:Joi.string().required(),
                schdule_startend:Joi.string().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {tokentranserivce}=request.services();
            var res= await tokentranserivce.create(db,request.payload)
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