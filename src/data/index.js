/* eslint-disable no-console */
/* eslint-disable global-require */
const mongoose = require( 'mongoose' )

const uri = process.env.DB_URI

mongoose.connect(
  uri,
  { useNewUrlParser: true, useFindAndModify: false }, ( err ) => {
    const msg = err || 'MongoDB connected'
    console.log( msg )
  },
)

mongoose.Promise = global.Promise

module.exports = mongoose
