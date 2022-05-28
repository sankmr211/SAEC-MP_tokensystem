'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/token/schduletoken/fetch',
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
            const {scheduleserivce}=request.services();
            var res= await scheduleserivce.fetch(db,request.query)
            if(res.statusCode==200){
                return h.response(res).code(200)
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