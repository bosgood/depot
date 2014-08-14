var route = function(db) {
  return function getVersion(req, res) {
    var appId = req.param('appId');
    var versionId = req.param('versionId');

    if (!appId || !versionId) {
      res.status(400).send({ error: 'must provide appId, versionId' });
      return;
    }

    db.getVersion(appId, versionId, function(err, data) {
      if (err) {
        res.status(500).send({ error: err.toString() });
        return;
      }

      if (!data) {
        res.status(404).send({});
      } else {
        res.status(200).send(data);
      }
    });
  };
}

module.exports = route;
