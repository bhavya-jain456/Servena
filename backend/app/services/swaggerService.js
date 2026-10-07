'use strict';

// Swagger JSON document builder — auto-generates from Joi schemas.
const j2s = require('joi-to-swagger');
const fs = require('fs');

let swaggerDoc = {};
let doc = {};

swaggerDoc.createJsonDoc = (info) => {
    doc = {
        swagger: '2.0',
        info,
        paths: {},
        definitions: {},
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            apiKey: { type: 'apiKey', in: 'header', name: 'X-API-KEY' }
        },
        security: [{ apiKey: [] }]
    };
};

swaggerDoc.addNewRoute = (joiDefinition, path, method) => {
    if (!doc.paths[path]) doc.paths[path] = {};
    let swaggerParams = [];
    let tag = joiDefinition.group || 'Default';
    let description = joiDefinition.description || '';
    let model = joiDefinition.model || 'Model';

    if (joiDefinition.headers) {
        Object.keys(joiDefinition.headers).forEach((key) => {
            let { swagger } = j2s(joiDefinition.headers[key]);
            swaggerParams.push({ in: 'header', name: key, ...swagger });
        });
    }

    if (joiDefinition.params) {
        Object.keys(joiDefinition.params).forEach((key) => {
            let { swagger } = j2s(joiDefinition.params[key]);
            swaggerParams.push({ in: 'path', name: key, required: true, ...swagger });
        });
    }

    if (joiDefinition.query) {
        Object.keys(joiDefinition.query).forEach((key) => {
            let { swagger } = j2s(joiDefinition.query[key]);
            swaggerParams.push({ in: 'query', name: key, ...swagger });
        });
    }

    if (joiDefinition.body) {
        let { swagger } = j2s(require('joi').object(joiDefinition.body));
        doc.definitions[model] = swagger;
        swaggerParams.push({ in: 'body', name: 'body', schema: { $ref: `#/definitions/${model}` } });
    }

    doc.paths[path][method] = {
        tags: [tag],
        description,
        parameters: swaggerParams,
        responses: {
            200: { description: 'Success' },
            400: { description: 'Bad Request' },
            401: { description: 'Unauthorized' },
            500: { description: 'Internal Server Error' }
        }
    };

    // Write swagger.json
    fs.writeFileSync('swagger.json', JSON.stringify(doc, null, 2));
};

module.exports = { swaggerDoc };
