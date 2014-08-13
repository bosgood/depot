/**
 * Implements Connection with a Redis backend
 */

var Connection = require('../connection');
var redis = require('redis');

var PREFIX = 'depot:';
var KEYS = {
  latest:   function()   { return PREFIX + 'version-latest'; },
  apps:     function()   { return PREFIX + 'apps'; },
  versions: function()   { return PREFIX + 'versions'; },
  version:  function(id) { return PREFIX + 'version-' + id; },
  content:  function(id) { return PREFIX + 'content-' + id; },
  app:      function(id) { return PREFIX + 'app-' + id; }
};

function RedisConnection() {
  this.client = null;
}

RedisConnection.prototype = Object.create(Connection.prototype);

RedisConnection.prototype.connect = function(callback) {
  // TODO read redis config from ENV
  this.client = redis.createClient();
  this.connected = true;
  return this;
};

RedisConnection.prototype.disconnect = function(callback) {
  this.client.end();
  this.connected = false;
  return this;
};


RedisConnection.prototype.getLatest = function(callback) {
  this.client.get(KEYS.latest(), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getVersion = function(versionId, callback) {
  this.client.hmget(KEYS.version(versionId), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getVersions = function(limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  this.client.lrange(KEYS.versions(), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getApplications = function(limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  this.client.lrange(KEYS.apps(), offset, limit, function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getApplication = function(applicationId, callback) {
  this.client.get(KEYS.application(applicationId), function(err, res) {
    callback(err, res);
  });
};

module.exports = RedisConnection;
