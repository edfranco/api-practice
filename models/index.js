const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/express-cities'

mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,

    })
    .then(() => console.log(`MongoDB connected on port 27017`))
    .catch(err => console.log(err));

module.exports = {
    City: require('./City')
}