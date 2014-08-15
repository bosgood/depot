/**
 * Interface for abstracting over a database connection
 */
var Connection = require('../connection');
var mongoose = require('mongoose');

var Version = require('./mongo/version');
var Application = require('./mongo/application');

function MongoConnection() {
  this.connected = false;
  this.client = null;
}

MongoConnection.prototype = Object.create(Connection.prototype);

MongoConnection.prototype.connect = function(env, callback) {
  Connection.prototype.connect.apply(this, arguments);
  var connectionString =
    "mongodb://" +
    this.env.get('stores:mongo:host') +
    ':' +
    this.env.get('stores:mongo:port') +
    '/' +
    this.env.get('stores:mongo:collection')
  ;

  this.client = mongoose.connection;
  this.client.on('error', function() {
    if (typeof callback === 'function') {
      callback({
        message: 'unable to connect to mongo',
        store: 'mongo',
        connectionString: connectionString
      }, null);
    }
  });
  this.client.on('open', function() {
    if (typeof callback === 'function') {
      callback(null, {
        store: 'mongo',
        connectionString: connectionString
      });
    }
  });
  mongoose.connect(connectionString);
  return this;
};

MongoConnection.prototype.disconnect = function(callback) {
  Connection.prototype.disconnect.apply(this, arguments);
  this.connected = false;
  return this;
};

MongoConnection.prototype.getLatestContent = function(appId, callback) {
  Version.findOne({
    applicationId: appId,
    isLatest: true
  }, callback);
};

MongoConnection.prototype.updateLatestContent = function(appId, versionId, callback) {
};

MongoConnection.prototype.getContent = function(appId, versionId, callback) {
  Version.find({
    applicationId: appId,
    versionId: versionId
  }, callback);
};

MongoConnection.prototype.getVersion = function(appId, versionId, callback) {
  Version.findOne({
    applicationId: appId,
    versionId: versionId
  }, callback);
};

MongoConnection.prototype.getVersions = function(appId, limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  Version
    .find({
      applicationId: appId
    })
    .limit(limit)
    .skip(offset)
    .exec(callback)
  ;
};

MongoConnection.prototype.updateVersion = function(appId, versionId, params, callback) {
  Version.findOneAndUpdate({
    applicationId: appId,
    versionId: versionId
  },
  params, {
    upsert: true
  }, callback);
};

MongoConnection.prototype.getApplications = function(limit, offset, callback) {
  if (offset == null) {
    offset = 0;
  }

  if (limit <= 0) {
    limit = 20;
  }

  Application
    .find({})
    .limit(limit)
    .skip(offset)
    .exec(callback)
  ;
};

MongoConnection.prototype.getApplication = function(appId, callback) {
  Application.findOne({
    applicationId: appId
  }, callback);
};

MongoConnection.prototype.updateApplication = function(appId, params, callback) {
  Application.findOneAndUpdate({
    applicationId: appId
  },
  params, {
    upsert: true
  }, callback);
};

module.exports = MongoConnection;
