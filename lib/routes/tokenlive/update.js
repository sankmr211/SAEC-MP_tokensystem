'use strict';
//    "mongoose": "^4.1.12",
const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/token/live/update/{schdule_uid}',
    options: {
        validate: {
            params: Joi.object({
                schdule_uid: Joi.string().required()
            }),
            payload: Joi.object({
                token_no: Joi.number().optional(),
                status:Joi.string().optional()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { tokenliveservice } = request.services();
            var res = await tokenliveservice.update(db, request.params, request.payload)
            if (res.statusCode == 200) {
                return h.response(res).code(201)
            } else {
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