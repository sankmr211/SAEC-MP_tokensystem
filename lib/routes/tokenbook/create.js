'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/token/booking/create',
    options: {
        validate: {
            payload: Joi.object({
                schdule_name: Joi.string().required(),
                schdule_uid: Joi.string().required(),
                user_uid: Joi.string().required(),
                department_uid: Joi.string().required(),
                officer_uid: Joi.string().required(),
                schedule_starttime: Joi.string().required(),
                schedule_endtime: Joi.string().required(),
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const { bookingservice } = request.services();
            var res = await bookingservice.create(db, request.payload)
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