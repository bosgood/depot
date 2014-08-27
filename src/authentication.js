// Ensures client request is authenticated if a shared secret is required
function createAuthLayer(config, opts) {
  if (opts == null) {
    opts = {};
  }

  var noAuthPatterns = opts.noAuthPatterns || [];

  return function(req, res, next) {
    var serverSecret = config.get('secret');
    if (!serverSecret) {
      next();
      return;
    }

    var secretParameterName = config.get('secretUrlParameter') || 'secret';
    var clientSecret = req.param(secretParameterName);

    // Check url against routes for which there is no authentication required
    if (noAuthPatterns.length) {
      for (var i = 0; i < noAuthPatterns.length; i++) {
        if (noAuthPatterns[i].test(req.url)) {
          // Proceed if match found
          next();
          return;
        }
      }
    }

    if (clientSecret !== serverSecret) {
      res.status(403).send({ error: 'authentication failed. reason: invalid secret'});
    } else {
      next();
    }
  };
}

module.exports = createAuthLayer;
