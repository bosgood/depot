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
 * Gets the version contents for a specific id
 * @param {string} versionId
 * @param callback {err, data}
 */
Connection.prototype.getVersion = function(versionId, callback) {
};

/**
 * Gets the latest deployIds
 * @param {integer} limit (defaults to 20)
 * @param callback {err, data}
 */
Connection.prototype.getVersions = function(limit, callback) {
  if (limit <= 0) {
    limit = 20;
  }
};

/**
 * Gets the deployable applications
 * @param {integer} limit (defaults to 20)
 * @param callback {err, data}
 */
Connection.prototype.getApplications = function(limit, callback) {
  if (limit <= 0) {
    limit = 20;
  }
};

/**
 * Gets a specific application information object
 * @param {string} applicationId
 * @param callback {err, data}
 */
Connection.prototype.getApplication = function(applicationId, callback) {
};

module.exports = Connection;
