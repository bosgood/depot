var Promise = require('bluebird');

var route = function(db) {
  _getLatestContent = Promise.promisify(db.getLatestContent).bind(db);
  _getContent = Promise.promisify(db.getContent).bind(db);

  return function serveApp(req, res) {
    var urlSlug = req.param('urlSlug');
    var versionId = req.param('version');

    if (!urlSlug) {
      res.status(400).send({ error: 'must provide urlSlug' });
      return;
    }

    // Serve the latest or a specific version based on :versionId parameter
    var promise;
    if (versionId) {
      promise = _getContent(urlSlug, versionId);
    } else {
      promise = _getLatestContent(urlSlug);
    }

    promise.then(function(data) {
      if (!data || (Array.isArray(data) && !data.length)) {
        res.status(404).send({});
      } else {
        res.status(200).send(data);
      }
    })
    .catch(function(err) {
      res.status(500).send({ error: err.toString() });
      console.error(err.stack);
    });
  };
}

module.exports = route;
