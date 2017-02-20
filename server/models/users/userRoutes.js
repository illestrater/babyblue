const users = require('./userController');

module.exports = (app) => {
    app.post('/register', users.register);
    app.post('/login', users.login);
    app.get('/get-user/:id', users.getUser);
    app.get('/get-players', users.getPlayers);
};
