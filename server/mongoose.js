const config = require('./config/config');
const mongoose = require('mongoose');

module.exports = () => {
    const db = mongoose.connect(config.mongoose.db);
    require('./models/users/userModel');

    return db;
};
