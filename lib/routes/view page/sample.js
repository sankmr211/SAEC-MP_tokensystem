'use strict';

const Helpers = require('../helpers');
const Path=require('path');
module.exports = Helpers.withDefaults({
    method: 'get',
    path: '/viewpage',
    options: {

    },
    handler: async (request, h) => {
        var db = request.server.settings.app.getDatabaseConnection();
        const { tokenserivce } = request.services();
        var res = await tokenserivce.tokensetupfetch(db)
        console.log(res);
        const internals = {
            templatePath: 'basic',
            thisYear: new Date().getFullYear()
        };
        const relativePath = Path.relative(`${__dirname}/../..`, `${__dirname}/templates/${internals.templatePath}`);
        console.log(relativePath);
        return h.view('./s/index', {
            token :res,
            title: `Running ${relativePath} | hapi ${request.server.version}`,
            message: 'Hello Ejs!',
            year: internals.thisYear
        })
    }
});