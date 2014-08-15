var mongoose = require('mongoose');

var Content = mongoose.model('Content', {
  applicationId: String,
  contents: String,
  isLatest: Boolean
});

module.exports = Content;
