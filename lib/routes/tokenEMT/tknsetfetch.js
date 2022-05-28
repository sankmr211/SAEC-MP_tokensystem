'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/token/setup/fetch',
    options:{
        validate: {
            query: Joi.object({
                _id: Joi.string().optional()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { tokenserivce } = request.services();
            var res = await tokenserivce.tokensetupfetch(db,request.query)
            if(res.statusCode==200){
                return h.response(res).code(200)
            }else if(res.statusCode==204){
                return h.response(res).code(204)
            }
        } catch (err) {
            console.log(err);
            const res = h.response(err);
            res.code(500);
            return res;
        }
    }
});