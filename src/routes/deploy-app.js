var Promise = require('bluebird');

var route = function(db) {
  _getContent = Promise.promisify(db.getContent).bind(db);
  _updateLatestContent = Promise.promisify(db.updateLatestContent).bind(db);

  return function deployApp(req, res) {
    var appId = req.param('appId');
    var versionId = req.param('versionId');

    if (!appId || !versionId) {
      res.status(400).send({ error: 'must provide appId, versionId' });
      return;
    }

    // Update the latest with the contents of the specific version
    _getContent(appId, versionId).then(function(contents) {
      if (!contents) {
        res.status(404).send({});
      } else {
        return _updateLatestContent(appId, contents)
        .then(function(data) {
          res.status(200).send(data);
        });
      }
    })
    .catch(function(err) {
      res.status(500).send({ error: err.toString() });
      console.error(err.stack);
    });
  };
}

module.exports = route;
