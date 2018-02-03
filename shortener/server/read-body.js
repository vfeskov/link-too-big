// simplified version of https://github.com/stream-utils/raw-body
// only supports things i need, in the node version i use.
// it's also on-demand, if i don't call this function body never
// gets read from the socket

class BodyLimitExceeded extends Error {};

module.exports = {
  readBody ({ request, limit = 1000 }) {
    return new Promise((resolve, error) =>
      _readBody({ request, resolve, error, limit })
    );
  },
  BodyLimitExceeded
};


function _readBody ({ request, resolve, error, limit }) {
  if (request.headers['content-length'] > limit) {
    return error(new BodyLimitExceeded());
  }

  let buffer = [];
  let size = 0;

  request
    .on('data', onData)
    .on('error', onError)
    .on('end', onEnd);

  function onError (err) {
    console.error(err);
    done(err);
  }

  function onData (chunk) {
    buffer.push(chunk);
    size += chunk.length;
    if (size <= limit) { return; }
    done(new BodyLimitExceeded());
  }

  function onEnd () {
    const body = Buffer.concat(buffer).toString().trim();
    console.log('Body', body);
    done(null, body);
  }

  function done (err, data) {
    request.removeListener('data', onData);
    request.removeListener('error', onError);
    request.removeListener('end', onEnd);
    request.unpipe();
    request.pause();
    err ? error(err) : resolve(data);
  }
}
