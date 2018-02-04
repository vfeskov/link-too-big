const redis = require('redis');
const bluebird = require('bluebird');
const { REDIS_URL } = process.env;
const LASTID = 'lastid';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const db = redis.createClient(REDIS_URL);

module.exports = {
  async insert (link, random) {
    let id = await this.nextId();
    await db.multi()
      .set(id, random + link)
      .set(LASTID, id)
      .execAsync();
    return id;
  },

  async nextId () {
    let id = +await db.getAsync(LASTID) + 1;
    if (isNaN(id) || id <= 0) { id = 1; }
    while (await this.taken(id)) { id++; }
    return id;
  },

  async taken (id) {
    const taken = await db.getAsync(id)
    return !!taken;
  }
}
