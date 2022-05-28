'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class departmentservice extends Schmervice.Service {
    async create(db, payload) {
        console.log(payload)
        try {
            const { token_deparment } = this.server.app.models;
            var departmodel = db.model('token_deparment', token_deparment);
            var id = "depart" + Math.random().toString(16).slice(2);
            payload.department_uid = id;
            const create_drepart = new departmodel(payload);
            const create = await create_drepart.save();
            if (create) {
                const output = {
                    'statusCode': 200,
                    'message': 'add Success',
                    payload
                };
                return output;
            }
            else {
                const error = Boom.badRequest('Invalid Data');
                return error;
            }
        } catch (err) {
            if (err.code == 11000) {
                return Boom.conflict('Code Exist', payload);
            } else if (err._message.indexOf('validation failed') > -1) {
                return Boom.badRequest(err._message);
            }
            const error = Boom.badImplementation('Failed');
            return error;
        }

    }

    async fetch(db, query) {
        try {
            let filter = {}
            if (query.name !== undefined) {
                filter.name = query.name
            }
            else if (query.status !== undefined) {
                filter.status = query.status
            }
            else if(query._id != undefined){
                filter._id = query._id
            }

            const { token_deparment } = this.server.app.models;
            var departmodel = db.model('token_deparment', token_deparment);
            const fetchapi = await departmodel.find(filter);
            if (fetchapi.length > 0) {
                var response = {
                    'statusCode': 200,
                    'message': 'fetch Success',
                    data: fetchapi
                }
                return response;
            } else {
                var response = {
                    'statusCode': 204,
                    'message': 'not content',
                    data: []
                }
                return response;
            }
        }
        catch (err) {
            console.log(err);
            const error = Boom.badImplementation('Failed');
            return error;
        }
    }
    async update(db, param, payload) {
        try{
            let filter = { department_uid: param.id }
            const { token_deparment } = this.server.app.models;
            var departmodel = db.model('token_deparment', token_deparment);
            let updateres = await departmodel.updateOne(filter, payload);
            if (updateres) {
                var response = {
                    'statusCode': 200,
                    'message': 'fetch Success',
                    data: updateres
                }
                return response;
            } else {
                var response = {
                    'statusCode': 400,
                    'message': 'user not found'
                }
                return response;
            }
        }
        catch(err){
            if (err.code == 11000) {
                return Boom.conflict('Code Exist', payload);
            } else if (err._message.indexOf('validation failed') > -1) {
                return Boom.badRequest(err._message);
            }
            console.log(err);
            const error = Boom.badImplementation('Failed');
            return error;
        }
    }
    async delete(db,params){
        try {
            const { token_deparment } = this.server.app.models;
            var departmodel = db.model('token_deparment', token_deparment);
            const deletenumber = await departmodel.deleteOne({ "_id": params.id });
            if (deletenumber) {
                const output = {
                    'statusCode': 200,
                    'message': 'delete Success'
                };
                return output;
            } else {
                const error = Boom.badRequest('Invalid Data');
                return error;
            }

        } catch (err) {
            console.log(err);
            const error = Boom.badImplementation('Failed');
            return error;
        }
    }
}