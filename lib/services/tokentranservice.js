'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class tokentranserivce extends Schmervice.Service {

    async create(db, payload) {
        try {
            const { token_tran } = this.server.app.models;
            var tokentran = db.model('token_tran', token_tran);
            var id = "tran_uid" + Math.random().toString(16).slice(2);
            payload.tran_uid = id;
                const createtran = new tokentran(payload);
                const create = await createtran.save();
                if (create) {
                    const output = {
                        'statusCode': 200,
                        'message': 'created autotokensetup',
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
            if(query._id != undefined){
                filter._id = query._id
            }
            if(query.token_no !=undefined){
                filter.token_no=query.token_no
            }
            if(query.officer_uid != undefined){
                filter.officer_uid=query.officer_uid
            }
            if(query.user_uid != undefined){
                filter.user_uid=query.user_uid
            }
            const { token_tran } = this.server.app.models;
            var tokentran = db.model('token_tran', token_tran);
            const fetchapi = await tokentran.find(filter)
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
        try {
            let id={
                '_id' : param.id
            }
            const { token_tran } = this.server.app.models;
            var tokentran = db.model('token_tran', token_tran);
            let updateres = await tokentran.updateOne(id, payload);
            if (updateres) {
                var response = {
                    'statusCode': 200,
                    'message': 'update Success',
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
        catch (err) {
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
    async delete(db, params) {
        try {
            const { token_tran } = this.server.app.models;
            var tokentran = db.model('token_tran', token_tran);
            const deletedata = await tokentran.deleteOne({ "_id": params.id });
            if (deletedata) {
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