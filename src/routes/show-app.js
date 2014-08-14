var route = function(db) {
  return function getApplication(req, res) {
    var appId = req.param('id');

    if (!appId) {
      res.status(400).send({ error: 'must provide appid' });
      return;
    }

    db.getApplication(appId, function(err, data) {
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
