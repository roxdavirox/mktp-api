const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';

const uri = process.env.DB_URI  || require('../config/mongodb.json')[env];

console.log('env:',env, 'uri', uri);

mongoose.connect(
  uri,
  { useNewUrlParser: true }, err => {
    if (err)
      console.log('Error: ', err);
  }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;