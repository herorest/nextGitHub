const Redis = require('ioredis');

const redis = new Redis({
    port: '6300',
    password: '123456'
});

const getKeys = async function(){
    await redis.set('mem', 1);
    const keys = await redis.keys('*');
    console.log(keys);
}

getKeys();