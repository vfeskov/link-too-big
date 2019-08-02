const { RND_STRLEN } = require('../lib/id-encoding');
const redis = require('redis');
const bluebird = require('bluebird');
const { REDIS_URL } = process.env;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const db = redis.createClient(REDIS_URL);

module.exports = {
  async get (id) {
    const row = await db.getAsync(id);
    if (!row) { return {}; }
    const random = row.slice(0, RND_STRLEN);
    const link = row.slice(RND_STRLEN);
    return { random, link };
  }
}
