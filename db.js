const mongoose = require('mongoose');
const config = require('./config')
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose.connect(config.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));
