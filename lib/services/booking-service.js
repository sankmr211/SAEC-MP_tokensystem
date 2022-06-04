'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class bookingservice extends Schmervice.Service {
    async create(db, payload) {
        try {
            console.log(payload)
            const { tokenbooking, token_schdule } = this.server.app.models;
            var tkb_booking = db.model('tokenbooking', tokenbooking);
            var schdulemodel = db.model('token_schdule', token_schdule);
            payload.status = "pending";
            const createbook = new tkb_booking(payload);
            const create = await createbook.save();
            if (create) {
                schdulemodel.update({ schdule_uid: payload.schdule_uid }, { $inc: { remaining_count: -1 } }, { new: true }, function (err, response) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log(response);
                    }
                })
                const output = {
                    'statusCode': 200,
                    'message': 'add Success',
                    create
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
            if (query.token_no !== undefined) {
                filter.token_no = query.token_no
            }
            if (query._id !== undefined) {
                filter._id = query._id
            }
            if(query.user_uid != undefined){
                filter.user_uid=query.user_uid
            }if(query.department_uid!=undefined){
                filter.department_uid=query.department_uid
            }
            if(query.officer_uid !=undefined){
                filter.officer_uid=query.officer_uid
            }
            if(query.schdule_uid != undefined){
                filter.schdule_uid= query.schdule_uid
            }
            if(query.status!= undefined){
                filter.status=query.status
            }
            const { tokenbooking } = this.server.app.models;
            var tkb_booking = db.model('tokenbooking', tokenbooking);
            const fetchapi = await tkb_booking.find(filter);
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
            let filter = { token_no: param.token_no }
            const { tokenbooking } = this.server.app.models;
            var tkb_booking = db.model('tokenbooking', tokenbooking);
            let updateres = await tkb_booking.findOneAndUpdate(filter, payload,{new:true});
            if (updateres) {
                var response = {
                    'statusCode': 200,
                    'message': 'fetch Success',
                    data: updateres
                }
                return response;
            } else {
                var response = {
                    'statusCode': 204,
                    'message': 'no content'
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
            const { tokenbooking } = this.server.app.models;
            var tkb_booking = db.model('tokenbooking', tokenbooking);
            const deletenumber = await tkb_booking.deleteOne({ "_id": params.id });
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