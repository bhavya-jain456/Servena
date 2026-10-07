const { createClient } = require('redis');
const { REDIS } = require('../../config');

module.exports = async () => {
    const redisConfig = {
        socket: {
            host: REDIS.HOST,
            port: REDIS.PORT
        }
    };
    if (REDIS.PASSWORD) {
        redisConfig.password = REDIS.PASSWORD;
    }

    const client = createClient(redisConfig);

    client.on('connect', () => {
        console.log('Connected to Redis');
    });

    client.on('error', (err) => {
        console.log('Redis error: ' + err);
    });

    await client.connect();
    global.redisClient = client;
};
