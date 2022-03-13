'use strict';

const HauteCouture = require('@hapipal/haute-couture');
const Package = require('../package.json');
const Mongoose = require('mongoose');
exports.plugin = {
    name:'mongodb',
    pkg: Package,
    register: async (server, options) => {
        
       

        
        function getDatabaseConnection() {

            if (server.app.connections[process.env.MONGO_DB_NAME]) {
                return server.app.connections[process.env.MONGO_DB_NAME];
            } else {
                server.app.connections[process.env.MONGO_DB_NAME] = Mongoose.createConnection('mongodb://localhost:27017/' + process.env.MONGO_DB_NAME, {
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                });
                return server.app.connections[process.env.MONGO_DB_NAME];
            }
        }
        server.app.connections = [];

        server.app.connection = Mongoose.createConnection(options.mongoURI + 'token_system', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        server.app.connection.once('open', () => {

            console.log('Connection Created');
        });

        server.settings.app = {};
        server.settings.app.getDatabaseConnection = getDatabaseConnection;


        await HauteCouture.compose(server, options);
    }
};
