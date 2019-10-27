const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/node_rest_api';
mongoose.connect(mongoDB,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;