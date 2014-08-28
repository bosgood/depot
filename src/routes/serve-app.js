var Promise = require('bluebird');

var route = function(db) {
  _getLatestContent = Promise.promisify(db.getLatestContent).bind(db);
  _getContent = Promise.promisify(db.getContent).bind(db);

  return function serveApp(req, res) {
    var appId = req.param('appId');
    var versionId = req.param('version');

    if (!appId) {
      res.status(400).send({ error: 'must provide appId' });
      return;
    }

    // Serve the latest or a specific version based on :versionId parameter
    var promise;
    if (versionId) {
      promise = _getContent(appId, versionId);
    } else {
      promise = _getLatestContent(appId);
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
