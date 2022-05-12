'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/setup/create',
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                depart_name:Joi.string().required(),
                depart_id: Joi.string().required(),
                officer_name:Joi.string().required(),
                user_id:Joi.string().required(),
                active:Joi.boolean().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {tokenserivce}=request.services();
            var res= await tokenserivce.tokensetupcreate(db,request.payload)
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