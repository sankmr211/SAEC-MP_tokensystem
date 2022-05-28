'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class counterservice extends Schmervice.Service {
    async create(db, payload) {
        try {
            const { token_counter } = this.server.app.models;
            var tkn_counter = db.model('token_counter', token_counter);
            var id = "counter" + Math.random().toString(16).slice(2);
            payload.counter_uid = id;
            const create_counter = new tkn_counter(payload);
            const create = await create_counter.save();
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

            const { token_counter } = this.server.app.models;
            var tkn_counter = db.model('token_counter', token_counter);
            const fetchapi = await tkn_counter.find(filter).skip(query.skip).limit(query.take);
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
            let filter = { counter_uid: param.id }
            const { token_counter } = this.server.app.models;
            var tkn_counter = db.model('token_counter', token_counter);
            let updateres = await tkn_counter.updateOne(filter, payload);
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
            const { token_counter } = this.server.app.models;
            var tkn_counter = db.model('token_counter', token_counter);
            const deletenumber = await tkn_counter.deleteOne({ "_id": params.id });
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