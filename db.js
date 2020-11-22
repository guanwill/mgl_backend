const mongoose = require('mongoose');
const config = require('./config')
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

console.log('db....', config.mongodb_url)
mongoose.connect(config.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('db connection successful'))
  .catch((err) => console.error(err));
