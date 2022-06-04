'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');

module.exports = class tokenliveservice extends Schmervice.Service {
    async create(db, payload) {
        try {
            const { tokenlive} = this.server.app.models;
            var tokencreate = db.model('tokenlive', tokenlive);
            const createlive = new tokencreate(payload);
            const create = await createlive.save();
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
            if (query.schdule_uid !== undefined) {
                filter.schdule_uid = query.schdule_uid
            }
           
            const { tokenlive} = this.server.app.models;
            var tknlive = db.model('tokenlive', tokenlive);
            const fetchapi = await tknlive.find(filter)//.lean().exec();
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
            let filter = { schdule_uid: param.schdule_uid }
            let fetchfilter={}
            if (param.schdule_uid !== undefined) {
                fetchfilter.schdule_uid = param.schdule_uid
            }
            const { tokenlive} = this.server.app.models;
            var tknliveupdate = db.model('tokenlive', tokenlive);
     
            let updatedata={}
            if(payload.status=='A'){
                const updatefetch = await tknliveupdate.find(fetchfilter)//.lean().exec(); use to see data without modal retrun
                updatefetch[0].token_no.push(payload.token_no)
               updatedata.token_no= updatefetch[0].token_no.sort((a,b)=>{ return a-b})
            }
            else if(payload.status=='D'){
                const updatefetch = await tknliveupdate.find(fetchfilter)//.lean().exec(); use to see data without modal retrun
                updatefetch[0].token_no.shift()
               updatedata.token_no= updatefetch[0].token_no.sort((a,b)=>{ return a-b})
            }
            let updateres = await tknliveupdate.findOneAndUpdate(filter, updatedata,{new:true})
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
}