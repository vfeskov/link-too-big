const http = require('http');
const serveStatic = require('serve-static');
const compression = require('compression');
const api = require('./api-middleware');
const { logger, chain } = require('./util');
const { NODE_ENV } = process.env;

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
