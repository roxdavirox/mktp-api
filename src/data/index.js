const mongoose = require('mongoose');

const { user, pass } = require('../config/mongodb.json');

const url = `mongodb+srv://${user}:${pass}@mktp-cluster-icaeh.mongodb.net/test?retryWrites=true`;

mongoose.connect(
  url,
  { useNewUrlParser: true }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;