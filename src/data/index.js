/* eslint-disable no-console */
/* eslint-disable global-require */
const mongoose = require('mongoose');

const uri = process.env.DB_URI;

console.log('[mktp] conectando banco de dados');
mongoose.connect(
  uri,
  { useNewUrlParser: true, useFindAndModify: false }, (err) => {
    const msg = err || '[mktp] banco de dados conectado';
    console.log(msg);
  },
);

mongoose.Promise = global.Promise;

module.exports = mongoose;
