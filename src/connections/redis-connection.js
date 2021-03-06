/**
 * Implements Connection with a Redis backend
 */

var Connection = require('../connection');
var redis = require('redis');
var Promise = require('bluebird');

var PREFIX = 'depot:';
var KEYS = {
  apps:     function()   { return PREFIX + 'apps'; },
  versions: function(id) { return PREFIX + 'versions:' + id; },
  app:      function(id) { return PREFIX + 'app:' + id; },
  latest:   function(id) { return KEYS.content(id, 'latest'); },
  version:  function(appId, versionId) {
    return PREFIX + 'version:' + appId + ':' + versionId;
  },
  content:  function(appId, versionId) {
    return PREFIX + 'content:' + appId + ':' + versionId;
  }
};

function RedisConnection() {
  this.client = null;
}

RedisConnection.prototype = Object.create(Connection.prototype);

RedisConnection.prototype.connect = function(env, callback) {
  Connection.prototype.connect.apply(this, arguments);
  this.client = redis.createClient(
    this.env.get('stores:redis:port'),
    this.env.get('stores:redis:host')
  );
  var connectionString =
    "redis://" +
    this.env.get('stores:redis:host') +
    ':' +
    this.env.get('stores:redis:port')
  ;

  if (typeof callback === 'function') {
    callback(null, {
      store: 'redis',
      connectionString: connectionString
    })
  }
  return this;
};

RedisConnection.prototype.disconnect = function(callback) {
  Connection.prototype.disconnect.apply(this, arguments);
  this.client.end();
  return this;
};

RedisConnection.prototype.getLatestContent = function(appId, callback) {
  this.client.get(KEYS.latest(appId), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.updateLatestContent = function(appId, versionId, callback) {
  client = this.client;
  this.getContent(appId, versionId, function(err, contents) {
    if (err) {
      callback(err);
      return;
    }

    client.set(KEYS.latest(appId), contents, function(err, res) {
      callback(err, res);
    });
  });
};

RedisConnection.prototype.getContent = function(appId, versionId, callback) {
  this.client.get(KEYS.content(appId, versionId), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getVersion = function(appId, versionId, callback) {
  this.client.hgetall(KEYS.version(appId, versionId), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getVersions = function(appId, limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  this.client.zrange(KEYS.versions(appId), offset, limit, function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.updateVersion = function(appId, versionId, params, callback) {
  var contents = params.contents;
  delete params.contents;

  this.client.multi()
    .del(KEYS.version(appId, versionId))
    .zadd(KEYS.versions(appId), params.createdAt, versionId)
    .hmset(KEYS.version(appId, versionId), params)
    .set(KEYS.content(appId, versionId), contents)
    .exec(function(err, res) {
      callback(err, res);
    });
}

RedisConnection.prototype.getApplications = function(limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  this.client.zrange(KEYS.apps(), offset, limit, function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.getApplication = function(appId, callback) {
  this.client.hgetall(KEYS.app(appId), function(err, res) {
    callback(err, res);
  });
};

RedisConnection.prototype.updateApplication = function(appId, params, callback) {
  this.client.multi()
    .del(KEYS.app(appId))
    .zadd(KEYS.apps(), params.createdAt, appId)
    .hmset(KEYS.app(appId), params)
    .exec(function(err, res) {
      callback(err, res);
    });
};

module.exports = RedisConnection;
