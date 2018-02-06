const http = require('http');
const Handler = require('./handler');

if (!process.env.SHORTENER_URL) {
  console.error('SHORTENER_URL environment variable is required');
  process.exit(1);
}

const server = http.createServer(
  (request, response) => {
    console.log(request.method + ' ' + request.url);
    new Handler({ request, response }).handle();
  }
).on('error', console.error);

server.listen(process.env.PORT || 10000, () => {
  console.log('Listening on', server.address());
});
