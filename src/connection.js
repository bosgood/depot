/**
 * Abstracts over a database connection
 */

function Connection() {
  this.connected = false;
}

Connection.prototype.connect = function() {
  this.connected = true;
  return this;
};

module.exports = Connection;
