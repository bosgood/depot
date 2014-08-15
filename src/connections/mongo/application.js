var mongoose = require('mongoose');

var Application = mongoose.model('Application', {
  name: String,
  urlSlug: String,
  createdAt: Date
});

module.exports = Application;
