'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/token/depart/update/{id}',
    options: {
        validate: {
            params: Joi.object({
                id:Joi.string().required()
            }),
            payload: Joi.object({
                name: Joi.string().min(3).required(),
                description: Joi.string().required(),
                status:Joi.string().valid('active','inactive').required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {departmentservice}=request.services();
            var res= await departmentservice.update(db,request.params,request.payload)
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