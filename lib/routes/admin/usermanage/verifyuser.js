'use strict';

const Helpers = require('../../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/token/user/verify/{id}',
    options: {
        validate: {
            params: Joi.object({
                id: Joi.string().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { userservice } = request.services();
            var res = await userservice.verify(db, request.params)
            if(res.statusCode==200){
                return h.response(res).code(200)
            }else if(res.statusCode==400){
                return h.response(res).code(400)
            }
        } catch (err) {
            console.log(err);
            const res = h.response(err);
            res.code(500);
            return res;
        }
    }
});