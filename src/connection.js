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
 * @param {string} application id
 * @param callback {err, data}
 */
Connection.prototype.getLatestContent = function(appId, callback) {
};

/**
 * Updates the latest version contents to the given versionId
 * @param {string} application id
 * @param {string} versionId version to promote to latest
 * @param callback {err, data}
 */
Connection.prototype.updateLatestContent = function(appId, versionId, callback) {
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
 * Creates or updates an application version
 * @param {object} version parameters
 * @param callback {err, data}
 */
Connection.prototype.updateVersion = function(appId, versionId, params, callback) {
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
 * @param {string} appId
 * @param callback {err, data}
 */
Connection.prototype.getApplication = function(appId, callback) {
};

/**
 * Creates or updates an application
 * @param {string} appId
 * @param {object} application parameters
 * @param callback {err, data}
 */
Connection.prototype.updateApplication = function(appId, params, callback) {
};

module.exports = Connection;
