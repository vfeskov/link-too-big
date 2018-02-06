const { NS, decode, RND_STRLEN } = require('../lib/id-encoding');
const db = require('./db');
const { SHORTENER_URL } = process.env;
const VALID_PATH = new RegExp(`^/[${NS.join('')}]{${RND_STRLEN + 1},}$`);
const REDIRECT = 301;

module.exports = class Handler {
  constructor ({ request, response }) {
    this.request = request;
    this.response = response;
  }

  async handle () {
    try {
      this.parseUrl();
      if (!this.valid()) { throw new NotFound(); }
      this.decodePath();
      if (!this.id) { throw new NotFound(); }
      const { random, link } = await db.get(this.id);
      if (!link || random !== this.random) { throw new NotFound(); }
      this.respond(301, { Location: link });
    } catch (err) {
      if (err instanceof NotFound) {
        return this.respond(302, { Location: SHORTENER_URL });
      }
      console.error(err);
      this.respond(302, { Location: SHORTENER_URL });
    }
  }

  parseUrl () {
    const { method, url } = this.request;
    this.method = method;
    this.path = url.split('?')[0];
  }

  valid () {
    return this.method === 'GET' && VALID_PATH.test(this.path);
  }

  decodePath () {
    const { id, random } = decode(this.path.slice(1));
    this.id = id;
    this.random = random;
  }

  respond (status, extraHeaders = {}) {
    this.response.writeHead(status, Object.assign({
      'Content-Length': 0,
      'Connection': 'close'
    }, extraHeaders));
    this.response.end();
  }
}

class NotFound extends Error {}
