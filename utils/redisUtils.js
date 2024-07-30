const { client: redisClient } = require("../conf/redisClient");

// 임시 저장하기
const setTemporaryValue = async (key, value, seconds) => {
    try {
        await redisClient.setEx(key, seconds, value);
        console.log(`Set ${key} with value ${value} for ${seconds} seconds`);
    } catch (err) {
        console.error("Error setting temporary value:", err);
        throw err;
    }
};

// 영구 저장하기
const setPermanentValue = async (key, value) => {
    try {
        await redisClient.set(key, value);
        console.log(`Set ${key} with value ${value}`);
    } catch (err) {
        console.error("Error setting permanent value:", err);
        throw err;
    }
};

// 값 불러오기
const getValue = async (key) => {
    try {
        const value = await redisClient.get(key);
        if (value) {
            console.log(`Value for ${key}: ${value}`);
        } else {
            console.log(`${key} not found`);
        }
        return value;
    } catch (err) {
        console.error("Error getting value:", err);
        throw err;
    }
};

// 값 삭제하기
const deleteValue = async (key) => {
    try {
        const result = await redisClient.del(key);
        if (result) {
            console.log(`${key} deleted`);
        } else {
            console.log(`${key} not found`);
        }
    } catch (err) {
        console.error("Error deleting value:", err);
        throw err;
    }
};

module.exports = {
    setTemporaryValue,
    setPermanentValue,
    getValue,
    deleteValue,
};
