'use strict';

const { Joi } = require('../../utils/joiUtils');
const { exampleController } = require('../../controllers');

let routes = [
    {
        method: 'GET',
        path: '/v1/health',
        joiSchemaForSwagger: {
            group: 'System',
            description: 'Health check endpoint.',
            model: 'HealthCheck'
        },
        authFree: true, // No API key or auth required
        handler: exampleController.healthCheck
    },
    // Example authenticated route:
    // {
    //     method: 'GET',
    //     path: '/v1/example/protected',
    //     joiSchemaForSwagger: {
    //         headers: {
    //             authorization: Joi.string().required().description("User's JWT token.")
    //         },
    //         query: {
    //             page: Joi.number().optional().description('Page number'),
    //             limit: Joi.number().optional().description('Items per page'),
    //         },
    //         group: 'Example',
    //         description: 'Example protected route.',
    //         model: 'ExampleProtected'
    //     },
    //     auth: AVAILABLE_AUTHS.ALL,
    //     handler: exampleController.healthCheck
    // },
];

module.exports = routes;
