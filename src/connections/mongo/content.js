var mongoose = require('mongoose');

var Content = mongoose.model('Content', {
  applicationId: String,
  contents: String
});

module.exports = Content;
