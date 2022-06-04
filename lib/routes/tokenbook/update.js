'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'put',
    path: '/token/booking/update/{token_no}',
    options: {
        validate: {
            params: Joi.object({
                token_no: Joi.string().required()
            }),
            payload: Joi.object({
                schdule_name: Joi.string().optional(),
                schdule_uid: Joi.string().optional(),
                user_uid: Joi.string().optional(),
                department_uid: Joi.string().optional(),
                officer_uid: Joi.string().optional(),
                schedule_starttime: Joi.string().optional(),
                schedule_endtime: Joi.string().optional(),
                status:Joi.string().optional()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { bookingservice } = request.services();
            var res = await bookingservice.update(db, request.params, request.payload)
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