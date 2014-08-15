var mongoose = require('mongoose');

var Version = mongoose.model('Version', {
  createdAt: Date,
  versionId: String,
  applicationId: String,
  isLatest: Boolean,
  contents: String
});

module.exports = Version;
