var mongoose = require('mongoose');

var Version = mongoose.model('Version', {
  createdDate: Date,
  versionId: String,
  applicationId: String,
  isLatest: Boolean
});

module.exports = Version;
