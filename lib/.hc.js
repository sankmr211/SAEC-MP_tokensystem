'use strict';

module.exports = {
    add: [{
        place: 'models',
        list: true,
        signature: ['name', 'schema'],
        method: (server, options, name, schema) => {
            const { connection } = server.app;
            server.app.models = server.app.models || {};
            server.app.models[name] = schema;
        },
        example: {
            $requires: ['mongoose'],
            $value: {
                name: 'ModelName',
                schema: { $literal: 'new Mongoose.Schema({})' }
            }
        }
    }],
    recursive: true
};