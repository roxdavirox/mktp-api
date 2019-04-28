const mongoose = require('mongoose');

const { user, pass } = require('../config/mongodb.json');

const url = `mongodb+srv://${user}:${pass}@mktp-cluster-icaeh.mongodb.net/test?retryWrites=true`;

mongoose.connect(
  url,
  { useNewUrlParser: true }, err => {
    if (err)
      console.log('Error: ', err);
  }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;