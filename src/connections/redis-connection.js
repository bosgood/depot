/**
 * Implements Connection with a Redis backend
 */

var Connection = require('../connection');

function RedisConnection() {

}

RedisConnection.prototype = Object.create(Connection.prototype);

RedisConnection.prototype.connect = function() {
  console.log('redis connected!');
  return Connection.prototype.connect();
};

module.exports = RedisConnection;
