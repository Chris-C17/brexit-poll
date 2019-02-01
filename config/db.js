const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
    .connect
    ('mongodb://Kris:kris1591@ds113923.mlab.com:13923/brexit-poll')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));