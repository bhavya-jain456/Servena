'use strict';

const cron = require('node-cron');
const CONFIG = require('../../config');

let cronScheduler = {};

/**
 * Startup function to initialize cron jobs.
 * Add your cron job schedules below.
 */
cronScheduler.cronStartUpFunction = async () => {
    if (CONFIG.RUN_CRON == 'false' || CONFIG.RUN_CRON === false) {
        console.log('Cron jobs are disabled.');
        return;
    }
    console.log('Cron scheduler initialized.');

    // Example: Run every day at midnight
    // cron.schedule('0 0 * * *', async () => {
    //     console.log('Running daily cron job...');
    // });
};

module.exports = cronScheduler;
