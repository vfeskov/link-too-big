const redis = require('redis');
const bluebird = require('bluebird');
const { REDIS_URL } = process.env;
const LASTID_KEY = 'lastid';

bluebird.promisifyAll(redis.RedisClient.prototype);

const db = redis.createClient(REDIS_URL);

module.exports = {
  async insert (link, random) {
    const id = await db.incrAsync(LASTID_KEY);
    await db.setAsync(id, random + link);
    return id;
  }
}
