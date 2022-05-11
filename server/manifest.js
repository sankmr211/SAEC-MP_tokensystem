'use strict';

const Dotenv = require('dotenv');
const Confidence = require('confidence');
const Toys = require('toys');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('../package.json');


// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` });
const mongoURL = `mongodb://${process.env.MONGO_DB_HOST}/`;
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3000
        },
        routes: {
            security: true
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: ['error'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [{
                plugin: '../lib', // Main plugin
                options: { mongoURI: mongoURL }
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            },
            {
                plugin: Inert,
                options: {}
            },
            {
                plugin: Vision,
                options: {}
            },
            {
                plugin: HapiSwagger,
                options: {
                    info: {
                        title: 'API Documentation',
                        version: Package.version
                    }
                }
            },
           
        ]
    }
});