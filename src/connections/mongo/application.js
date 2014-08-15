var mongoose = require('mongoose');

var Application = mongoose.model('Application', {
  applicationId: String,
  urlSlug: String,
  createdAt: Date
});

module.exports = Application;
