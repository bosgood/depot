/**
 * Interface for abstracting over a database connection
 */
var Connection = require('../connection');
var mongoose = require('mongoose');

var Version = require('./mongo/version');
var Application = require('./mongo/application');
var Content = require('./mongo/content');

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
    this.env.get('stores:mongo:port')
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
};

MongoConnection.prototype.updateLatestContent = function(appId, versionId, callback) {
};

MongoConnection.prototype.getContent = function(appId, versionId, callback) {
};

MongoConnection.prototype.getVersion = function(appId, versionId, callback) {
};

MongoConnection.prototype.getVersions = function(appId, limit, offset, callback) {
};

MongoConnection.prototype.updateVersion = function(appId, versionId, params, callback) {
};

MongoConnection.prototype.getApplications = function(limit, offset, callback) {
};

MongoConnection.prototype.getApplication = function(appId, callback) {

};

MongoConnection.prototype.updateApplication = function(appId, params, callback) {
};

module.exports = MongoConnection;
