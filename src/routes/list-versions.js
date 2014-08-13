var route = function(db) {
  return function listVersions(req, res) {
    var appId = req.param('id');

    if (!appId) {
      res.status(400).send({ error: 'must provide appid' });
      return;
    }

    db.getVersions(appId, null, null, function(err, data) {
      if (err) {
        res.status(500).send({ error: err.toString() });
        return;
      }
      res.status(200).send(data);
    });
  };
}

module.exports = route;