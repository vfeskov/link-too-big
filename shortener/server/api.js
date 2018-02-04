const { encode, randomString } = require('../../lib/id-encoding');
const db = require('./db');
const { readBody, BodyLimitExceeded } = require('./read-body');
const { EXPANDER_URL } = process.env;
// https://mathiasbynens.be/demo/url-regex @diegoperini's version
const VALID_LINK = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

module.exports = function api (request, response, next) {
  new Handler({ request, response, next }).handle();
}

class Handler {
  constructor ({ request, response }) {
    this.request = request;
    this.response = response;
  }

  async handle () {
    try {
      if (!this.metaValid()) { throw new BadRequest(); }
      const link = await readBody({
        request: this.request,
        limit: 1000
      });
      if (!this.linkValid(link)) { throw new BadRequest(); }
      const escaped = encodeURI(link);
      const random = await randomString();
      const id = await db.insert(escaped, random);
      const short = `${EXPANDER_URL}/${encode(id, random)}`;
      console.log('Shortened', short);
      this.respond(201, short);
    } catch (err) {
      if (err instanceof BadRequest) { return this.respond(400); }
      if (err instanceof BodyLimitExceeded) { return this.respond(413); }
      console.error(err);
      this.respond(500);
    }
  }

  metaValid () {
    const { method, url, headers } = this.request;
    return method === 'POST' &&
           headers['content-type'] === 'text/plain' &&
           url === '/api/shorten';
  }

  respond (status, content = '') {
    this.response.writeHead(status, Object.assign({
      'Content-Type': 'text/plain',
      'Content-Length': content.length,
      'Connection': 'close'
    }));
    this.response.end(content);
  }

  linkValid (link) {
    return link && VALID_LINK.test(link);
  }
}

class BadRequest extends Error {}
