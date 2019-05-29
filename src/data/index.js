const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';

const uri = process.env.DB_URI  || require('../config/mongodb.json')[env];

mongoose.connect(
  uri,
  { useNewUrlParser: true, useFindAndModify: false }, err => {
    const msg = err || "MongoDB connected";
    console.log(msg);
  }
);

mongoose.Promise = global.Promise;

module.exports = mongoose;