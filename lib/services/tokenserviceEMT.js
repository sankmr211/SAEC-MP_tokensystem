'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class tokenserivce extends Schmervice.Service {

    async tokensetupcreate(db, payload) {
        try {
            const { token } = this.server.app.models;
            var autokensetup = db.model('token', token);
            var id = "token" + Math.random().toString(16).slice(2);
            payload.token_uid = id;
            let getfilter = {
                depart_id: payload.depart_id,
                user_id: payload.user_id
            }
            let data = await autokensetup.find(getfilter);
            if (data.length > 0) {
                return Boom.conflict('Code Exist', payload);
            } else if (data.length === 0) {
                const stupautoken = new autokensetup(payload);
                const create = await stupautoken.save();
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


    async tokensetupfetch(db, query) {
        try {
            let filter = {}
            if(query._id != undefined){
                filter._id = query._id
            }
            const { token } = this.server.app.models;
            var autokensetup = db.model('token', token);
            const fetchapi = await autokensetup.find(filter)
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


    async tokensetupdate(db, param, payload) {
        try {
            let id={
                '_id' : param.id
            }
            const { token } = this.server.app.models;
            var autokensetup = db.model('token', token);
            let updateres = await autokensetup.updateOne(id, payload);
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
    async tokensetupdelete(db, params) {
        try {
            const { token } = this.server.app.models;
            var autokensetup = db.model('token', token);
            const deletedata = await autokensetup.deleteOne({ "_id": params.id });
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