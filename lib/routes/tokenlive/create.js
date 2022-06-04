'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/live/create',
    options: {
        validate: {
            payload: Joi.object({
                schdule_uid: Joi.string().required(),
                token_no: Joi.array().optional(),
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { tokenliveservice } = request.services();
            var res = await tokenliveservice.create(db, request.payload)
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