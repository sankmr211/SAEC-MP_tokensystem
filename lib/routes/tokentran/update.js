'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/token/tokentran/update/{id}',
    options: {
        validate: {
            params: Joi.object({
                id:Joi.string().required()
            }),
            payload: Joi.object({
                schedulename: Joi.string().required(),
                schdule_uid:Joi.string().required(),
                user_uid: Joi.string().required(),
                token_no:Joi.string().required(),
                department_uid:Joi.string().required(),
                time:Joi.string().required(),
                mobile_no:Joi.string().required(),
                status:Joi.string().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {tokenserivce}=request.services();
            var res= await tokenserivce.tokensetupdate(db,request.params,request.payload)
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