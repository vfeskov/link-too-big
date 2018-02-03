const http = require('http');
const Handler = require('./handler');

const server = http.createServer(
  (request, response) => {
    new Handler({ request, response }).handle();
  }
).on('error', console.error);

server.listen(process.env.PORT || 10000, () => {
  console.log('Listening on', server.address());
});
