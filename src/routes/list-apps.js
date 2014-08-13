var route = function(connection) {
  return function listApps(req, res) {
    connection.getApplications(null, null, function(err, data) {
      if (err) {
        res.status(500).send({ error: err.toString() });
        return;
      }
      res.status(200).send(data);
    });
  };
}

module.exports = route;