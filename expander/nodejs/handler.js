const { NS, decode } = require('../../lib/id-encoding');
const db = require('./db');
const { SHORTENER_URL } = process.env;
const VALID_PATH = new RegExp(`^/[${NS.join('')}]+$`);
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
      const id = this.id();
      const link = await db.getAsync(id);
      if (!link) { throw new NotFound(); }
      this.respond(301, { Location: link });
    } catch (err) {
      if (err instanceof NotFound) {
        this.respond(302, { Location: SHORTENER_URL });
        return;
      }
      console.error(err);
      this.respond(500);
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

  id () {
    const code = this.path.slice(1);
    return decode(code);
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
