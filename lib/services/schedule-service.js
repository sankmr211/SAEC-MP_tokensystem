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
            payload.remaining_count=payload.count
            const now = moment()
            var comp2day2after = moment(payload.Start_time).isAfter(now)
            var compend2after = moment(payload.End_time).isAfter(payload.Start_time)
            if (comp2day2after && compend2after) {
                const createschdule = new schdulemodel(payload);
                const create = await createschdule.save();
                if (create) {
                    const output = {
                        'statusCode': 200,
                        'message': 'schdule created',
                        create
                    };
                    return output;
                }
                else {
                    const error = Boom.badRequest('Invalid payloadData');
                    return error;
                }
            }
            else {
                const error = Boom.badRequest('Invalid Date and time Data');
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
            if(query.user_uid!= undefined){
                filter.user_uid= query.user_uid
            }
            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            const fetchapi = await schdulemodel.find(filter)
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
            const { token_schdule } = this.server.app.models;
            var schdulemodel = db.model('token_schdule', token_schdule);
            let id = {
                '_id': param.id
            }
           if(Object.keys(payload).length==1){
            let statusupdate = await schdulemodel.findOneAndUpdate(id, payload,{new:true})
            if (statusupdate) {
                var response = {
                    'statusCode': 200,
                    'message': 'update Success',
                    data: statusupdate
                }
                return response;
            } else {
                var response = {
                    'statusCode': 204,
                    'message': 'user not found'
                }
                return response;
            }
           }else{
            const now = moment()
            var comp2day2after = moment(payload.Start_time).isAfter(now)
            var compend2after = moment(payload.End_time).isAfter(payload.Start_time)
            
            if (comp2day2after && compend2after) {
                let updateres = await schdulemodel.findOneAndUpdate(id, payload,{new:true});
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
            else {
                const error = Boom.badRequest('Invalid Date and time Data');
                return error;
            }
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
            const deletedata = await schdulemodel.remove({ "_id": params.id });
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