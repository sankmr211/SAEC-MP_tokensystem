'use strict';

const ejs = require('ejs');
const HauteCouture = require('haute-couture');
const Vision = require('@hapi/vision');
const Package = require('../package.json');
const Mongoose = require('mongoose');

exports.plugin = {
    name: 'mongodb',
    pkg: Package,
    register: async (server, options) => {
        await server.register(Vision);

        server.views({
            engines: {
                html: ejs
            },
            path: __dirname + '/view',
        })

        Mongoose.set('debug', false);
        Mongoose.set('useCreateIndex', true);
        Mongoose.set('useFindAndModify', false);
        Mongoose.set('useUnifiedTopology', true)
        Mongoose.set('useNewUrlParser', true)
        


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

        server.app.connection = Mongoose.createConnection(options.mongoURI + 'tokensystem', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        server.app.connection.once('open', () => {

            console.log('Connection Created');
        });

        server.settings.app = {};
        server.settings.app.getDatabaseConnection = getDatabaseConnection;


        await HauteCouture.using()(server, options);
        // server.route({
        //     method: 'get',
        //     path: '/',
        //     handler: {
        //         view: { template: 'index' }
        //     }
        // });

        // server.route({
        //     method: 'GET',
        //     path: '/',
        //     handler: async (request, h) => {
        //         try{
        //             const internals = {
        //                 templatePath: 'basic',
        //                 thisYear: new Date().getFullYear()
        //             };
        //             const relativePath = Path.relative(`${__dirname}/../..`, `${__dirname}/templates/${internals.templatePath}`);
        //             const n = Path.relative(__dirname + '../lib/view');

        //             console.log(n);
        //             return h.view('index', {
        //                 title: `Running ${relativePath} | hapi ${request.server.version}`,
        //                 message: 'Hello Ejs!',
        //                 year: internals.thisYear
        //             })
        //         }
        //         catch(err){
        //             console.log("sdeff",err)
        //         }

        //     }
        // })
    }
};

// const HauteCouture = require('haute-couture');
// const Package = require('../package.json');
// const Mongoose = require('mongoose');

// exports.plugin = {
//     name: 'mongodb',
//     pkg: Package,
//     register: async (server, options) => {   
//         Mongoose.set('debug', false);
//         Mongoose.set('useCreateIndex', true);
//         Mongoose.set('useFindAndModify', false);

//         function getDatabaseConnection() {

//             if (server.app.connections[process.env.MONGO_DB_NAME]) {
//                 return server.app.connections[process.env.MONGO_DB_NAME];
//             } else {
//                 server.app.connections[process.env.MONGO_DB_NAME] = Mongoose.createConnection('mongodb://localhost:27017/' + process.env.MONGO_DB_NAME, {
//                     useUnifiedTopology: true,
//                     useNewUrlParser: true
//                 });
//                 return server.app.connections[process.env.MONGO_DB_NAME];
//             }
//         }

//         server.app.connections = [];

//         server.app.connection = Mongoose.createConnection(options.mongoURI + 'tokensystem', {
//             useUnifiedTopology: true,
//             useNewUrlParser: true
//         });
//         server.app.connection.once('open', () => {

//             console.log('Connection Created');
//         });

//         server.settings.app = {};
//         server.settings.app.getDatabaseConnection = getDatabaseConnection;
//         await HauteCouture.using()(server, options);
//     }
// };