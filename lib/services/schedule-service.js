'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');
var moment = require('moment');

module.exports = class scheduleserivce extends Schmervice.Service {

    async create(db, payload) {
        try {
            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            var id = "token_schdule" + Math.random().toString(16).slice(2);
            payload.schdule_uid = id;
            console.log(payload.Start_time)
            const now = moment()
            var n= moment(payload.Start_time).isAfter(now)
            console.log(n)
            

            const createschdule = new schdulemodel(payload);
            const create = await createschdule.save();
            if (create) {
                const output = {
                    'statusCode': 200,
                    'message': 'schdule created',
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

            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            const fetchapi = await schdulemodel.find()
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
            let id = {
                '_id': param.id
            }
            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            let updateres = await schdulemodel.findOneAndUpdate(id, payload);
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
            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            const deletedata = await schdulemodel.deleteOne({ "_id": params.id });
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