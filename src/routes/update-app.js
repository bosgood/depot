var uuid = require('node-uuid');
var Promise = require('bluebird');

var route = function(db) {
  _getApplication = Promise.promisify(db.getApplication).bind(db);
  _updateApplication = Promise.promisify(db.updateApplication).bind(db);

  return function updateApplication(req, res) {
    var appId = req.param('id');
    var urlSlug = req.param('urlSlug')

    if (!appId || !urlSlug) {
      res.status(400).send({ error: 'must provide appId, urlSlug' });
      return;
    }

    var isNew = false;
    var params = {
      id: uuid.v4(),
      name: appId,
      urlSlug: urlSlug,
      createdDate: new Date().getTime()
    };

    _getApplication(appId)
    .then(function(data) {
      // App is being created, createdDate is now
      if (!data) {
        isNew = true;
      // App already exists, keep the immutable properties
      } else {
        params.id = data.id;
        params.createdDate = data.createdDate;
      }

      return _updateApplication(appId, params)
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
