var route = function(db) {
  return function listApps(req, res) {
    db.getApplications(null, null, function(err, data) {
      if (err) {
        res.status(500).send({ error: err.toString() });
        return;
      }
      res.status(200).send(data);
    });
  };
}

module.exports = route;