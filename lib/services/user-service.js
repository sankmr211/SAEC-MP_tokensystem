'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = class userservice extends Schmervice.Service {

    async create(db, payload) {
        try {
            const { user } = this.server.app.models;
            var usermodel = db.model('user', user);
            var id = "user" + Math.random().toString(16).slice(2);
            payload.user_uid = id;
            payload.activate_status = false;
            payload.count=0;
            var transporter = nodemailer.createTransport(smtpTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'sanrock211@gmail.com',
                    pass: '9042136400'
                }
            }));
            console.log(payload)
            const create_user = new usermodel(payload);
            const create = await create_user.save();
            if (create) {
                const output = {
                    'statusCode': 200,
                    'message': 'add Success',
                    "email_verification_mail": "sended",
                    payload
                };
                var mailOptions = {
                    from: 'sanrock211@gmail.com',
                    to: `${payload.email_id}`,
                    subject: 'Token confirmation!',
                    text: `Hello ${payload.name}
    
                    You registered an account on portal, before being able to use your account you need to verify that this is your email address by clicking here: http://0.0.0.0:8003/token/user/verify/${id}
                    
                    Kind Regards,
                    token system`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

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
            else if (query.mobile_no !== undefined) {
                filter.mobile_no = query.mobile_no
            }
            else if (query.email_id !== undefined) {
                filter.email_id = query.email_id
            }

            const { user } = this.server.app.models;
            var usermodel = db.model('user', user);
            const fetchapi = await usermodel.find(filter).skip(query.skip).limit(query.take);
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
            let filter = { uid: param.id }
            const { user } = this.server.app.models;
            var usermodel = db.model('user', user);
            let updateres = await usermodel.updateOne(filter, payload);
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
            const { user } = this.server.app.models;
            var usermodel = db.model('user', user);
            const deletedata = await usermodel.deleteOne({ "_id": params.id });
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


    async verify(db, params) {
        try {

            const { user } = this.server.app.models;
            var usermodel = db.model('user', user);
            const finddata = await usermodel.find({ "uid": params.id });
            if (finddata.length > 0 && finddata[0].count ===0) {
                let useractive_status=await usermodel.findOneAndUpdate({ "uid": params.id }, {"activate_status":true, "count":1});
                    var output={
                        "statusCode":200,
                        "message":"user verified successfully"
                    }
                    return output;
            }else{
                var output={
                    "statusCode":400,
                    "message":"user is already verify"
                }
                return output
            }
        } catch (err) {
            console.log(err);
            const error = Boom.badImplementation('Failed');
            return error;
        }
    }
}