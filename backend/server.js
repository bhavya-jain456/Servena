'use strict';

/***********************************
 **** node module defined here *****
 ***********************************/
require('dotenv').config();
const EXPRESS = require("express");
const { SERVER, SERVER_TYPE_ENV } = require('./config');
const { SERVER_TYPES } = require('./app/utils/constants');

/** creating express server app for server */
const app = EXPRESS();

/********************************
 ***** Server Configuration *****
 ********************************/
if (SERVER_TYPE_ENV != SERVER_TYPES.SOCKET) {
    app.set('port', SERVER.PORT);
}
const server = require('http').Server(app);

/** Server is running here */
let startNodeserver = async () => {
    // Initialize Redis
    await require('./app/startup/db_redis')();

    // Initialize MongoDB
    await require('./app/startup/db_mongo')();

    if (SERVER_TYPE_ENV !== SERVER_TYPES.SOCKET) {
        // Express startup
        await require('./app/startup/expressStartup')(app);
    }

    // Initialize cron jobs
    await require('./app/startup/cronScheduler').cronStartUpFunction();

    return new Promise((resolve, reject) => {
        if (SERVER_TYPE_ENV !== SERVER_TYPES.SOCKET || SERVER.PORT == SERVER.SOCKET_PORT) {
            server.listen(SERVER.PORT, (err) => {
                if (err) reject(err);
                resolve();
            });
        } else {
            resolve();
        }
    });
};

startNodeserver().then(() => {
    console.log('Node server running on', SERVER.URL);
}).catch((err) => {
    console.log('Error in starting server', err);
    process.exit(1);
});

process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error);
});

// #9 Graceful shutdown — close connections cleanly on deploy/restart
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
        console.log(`${signal} received. Shutting down gracefully...`);
        server.close(() => {
            require('mongoose').connection.close().then(() => {
                if (global.redisClient) {
                    global.redisClient.quit().then(() => process.exit(0));
                } else {
                    process.exit(0);
                }
            });
        });
        // ponytail: force kill after 10s if graceful shutdown hangs
        setTimeout(() => process.exit(1), 10000);
    });
});
