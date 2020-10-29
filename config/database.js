const mongoose = require('mongoose');
const mongoDB = process.env.DATABASE_URI;
mongoose.connect(mongoDB,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;