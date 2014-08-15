var uuid = require('node-uuid');
var Promise = require('bluebird');

var route = function(db) {
  _getVersion = Promise.promisify(db.getVersion).bind(db);
  _updateVersion = Promise.promisify(db.updateVersion).bind(db);

  return function updateVersion(req, res) {
    var appId = req.param('appId')
    var versionId = req.param('versionId');
    var contents = req.param('contents');

    if (!appId || !versionId || !contents) {
      res.status(400).send({ error: 'must provide appId, versionId, contents' });
      return;
    }

    var isNew = false;
    var params = {
      id: uuid.v4(),
      applicationId: appId,
      name: versionId,
      createdAt: new Date().getTime(),
      contents: contents
    };

    _getVersion(appId, versionId)
    .then(function(data) {
      // Version is being created, createdAt is now
      if (!data) {
        isNew = true;
      // Version already exists, keep the immutable properties
      } else {
        params.id = data.id;
        params.createdAt = data.createdAt;
      }

      return _updateVersion(appId, versionId, params)
      .then(function(data) {
        var statusCode = (isNew) ? 201 : 200;
        res.status(statusCode).send(params);
      });
    })
    .catch(function(err) {
      res.status(500).send({ error: err.toString() });
      console.error(err.stack);
    });
  };
}

module.exports = route;
