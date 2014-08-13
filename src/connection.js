/**
 * Interface for abstracting over a database connection
 */
function Connection() {
  this.connected = false;
}

/**
 * Connects to the datastore
 * @param callback {err, data}
 */
Connection.prototype.connect = function(callback) {
  this.connected = true;
  return this;
};

/**
 * Disconnects from the datastore
 * @param callback {err, data}
 */
Connection.prototype.disconnect = function(callback) {
  this.connected = false;
  return this;
};

/**
 * Gets the latest version contents
 * @param callback {err, data}
 */
Connection.prototype.getLatest = function(callback) {
};

/**
 * Sets the latest version contents to the given versionId
 * @param {string} versionId version to promote to latest
 * @param callback {err, data}
 */
Connection.prototype.setLatest = function(versionId, callback) {
};

/**
 * Gets the version contents for a specific id
 * @param {string} versionId
 * @param callback {err, data}
 */
Connection.prototype.getVersion = function(versionId, callback) {
};

/**
 * Gets the latest deployIds
 * @param {string} application id
 * @param {integer} limit (defaults to 20)
 * @param {integer} offset (defaults to 0)
 * @param callback {err, data}
 */
Connection.prototype.getVersions = function(appId, limit, offset, callback) {
};

/**
 * Gets the deployable applications
 * @param {integer} limit (defaults to 20)
 * @param {integer} offset (defaults to 0)
 * @param callback {err, data}
 */
Connection.prototype.getApplications = function(limit, offset, callback) {
};

/**
 * Gets a specific application information object
 * @param {string} applicationId
 * @param callback {err, data}
 */
Connection.prototype.getApplication = function(applicationId, callback) {
};

module.exports = Connection;
