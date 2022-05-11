'use strict';

const Helpers = require('../../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/user/create',
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                password: Joi.string().required(),
                user_type:Joi.string().valid('admin','agent','client').required(),
                department_uid:Joi.string().optional(),
                mobile_no: Joi.string().required(),
                email_id:Joi.string().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {userservice}=request.services();
            var res= await userservice.create(db,request.payload)
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