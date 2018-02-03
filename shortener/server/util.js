class BodyLimitExceeded extends Error {};

module.exports = {
  logger (req, res, next) {
    console.log('Request', req.method, req.url);
    next();
  },

  chain (middlewares) {
    return (req, res) => {
      [...middlewares]
        .reverse()
        .reduce(
          (next, middleware) => () => {
            middleware(req, res, next)
          },
          null
        )()
    }
  }
}
