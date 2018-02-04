const http = require('http');
const serveStatic = require('serve-static');
const compression = require('compression');
const api = require('./api');
const { logger, chain } = require('./util');

if (!process.env.EXPANDER_URL) {
  console.error('EXPANDER_URL environment variable is required');
  process.exit(1);
}

const middlewares = [
  logger,
  compression(),
  serveStatic('../client/dist'),
  api
];

const server = http.createServer(
  chain(middlewares)
);
server.on('error', e => console.error('Server error', e));

server.listen(process.env.PORT || 20000, () => {
  console.log('Listening on', server.address());
});
