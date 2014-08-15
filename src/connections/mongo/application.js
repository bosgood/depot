var mongoose = require('mongoose');

var Application = mongoose.model('Application', {
  name: String,
  urlSlug: String,
  createdDate: Date
});

module.exports = Application;
