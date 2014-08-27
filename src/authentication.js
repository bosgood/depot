// Ensures client request is authenticated if a shared secret is required
function createAuthLayer(config) {
  return function(req, res, next) {
    var serverSecret = config.get('secret');
    if (!serverSecret) {
      next();
      return;
    }

    var secretParameterName = config.get('secretUrlParameter') || 'secret';
    var clientSecret = req.param(secretParameterName);
    if (clientSecret !== serverSecret) {
      res.status(403).send({ error: 'authentication failed. reason: invalid secret'});
    } else {
      next();
    }
  };
}

module.exports = createAuthLayer;
