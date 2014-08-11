/**
 * Abstracts over a database connection
 */

function Connection() {
  this.connected = false;
}

Connection.prototype.connect = function(err, data) {
  this.connected = true;
  return this;
};

module.exports = Connection;
