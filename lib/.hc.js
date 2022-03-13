'use strict';

module.exports = {
    models: {
        list: true,
        signature: ['name', 'schema'],
        method: (server, options, name, schema) => {

            const { connection } = server.app;

            // Access the Dog model as such in a route handler:
            // const { Dog } = request.server.app.models;

            server.app.models = server.app.models || {};
            server.app.models[name] = connection.model(name, schema);
        },
        // This example below isn't essential. But it allows you to use
        // `hpal make model <model-name>` in order to scaffold your
        // Mongoose models from the command line.
        example: {
            $requires: ['mongoose'],
            $value: {
                name: 'ModelName',
                schema: { $literal: 'new Mongoose.Schema({})'}
            }
        }
    }
};