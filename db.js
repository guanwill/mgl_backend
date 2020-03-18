const mongoose = require('mongoose');
const config = require('./config.json')
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb://${config.mongo_hostname}/mgl`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));
