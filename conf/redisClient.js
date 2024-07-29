const redis = require("redis");
require("dotenv").config();

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: undefined,
});

client.on("error", (err) => {
    console.log("Redis error:", err);
});

client.on("connect", () => {
    console.log("Connected to Redis server");
});

client.on("ready", () => {
    console.log("Redis client is ready");
});

client.on("end", () => {
    console.log("Redis connection closed");
});

(async () => {
    try {
        await client.connect();
        console.log("Redis client connected successfully");
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
})();

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
};

const checkRedisConnection = async () => {
    try {
        await connectRedis();
        const reply = await client.ping();
        console.log("Redis ping reply:", reply);
        return reply === "PONG";
    } catch (err) {
        console.error("Redis connection check failed:", err);
        return false;
    }
};

module.exports = { client, checkRedisConnection, connectRedis };
