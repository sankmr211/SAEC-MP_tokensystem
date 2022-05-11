'use strict';

const Helpers = require('../../helpers');
const Joi = require('@hapi/joi');
const string = require('@hapi/joi/lib/types/string');
module.exports = Helpers.withDefaults({
    method: 'delete',
    path: '/token/user/delete/{id}',
    options: {
        validate: {
            params: Joi.object({
                id:Joi.string().required()
            })
        },
    },
    handler: async (request, h) => {
        try {
            var db = request.server.settings.app.getDatabaseConnection();
            const {userservice}=request.services();
            var res= await userservice.delete(db,request.params)
            return res
        } catch (err) {
            console.log(err);
            const res = h.response(err);
            res.code(500);
            return res;
        }
    }
});