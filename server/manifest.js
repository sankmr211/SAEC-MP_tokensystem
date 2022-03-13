'use strict';

const Dotenv = require('dotenv');
const Confidence = require('@hapipal/confidence');
const Toys = require('@hapipal/toys');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('../package.json');
// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` });
const mongoURL = `mongodb://${process.env.MONGO_DB_HOST}/`;  //db url added
// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $param: 'PORT',
            $coerce: 'number',
            $default: process.env.PORT
        },
        debug: {
            $filter: 'NODE_ENV',
            $default: {
                log: ['error', 'start'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Main plugin
                options: { mongoURI: mongoURL}  //db connection
            },
            {
                plugin: {
                    $filter: 'NODE_ENV',
                    $default: '@hapipal/hpal-debug',
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
            }
        ]
    }
});
