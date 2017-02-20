import angular from 'angular';

const angularModule = angular.module('app.views', []);

const controllerComponents = [
    require('./frame/frame-ctrl'),
    require('./home/home-ctrl'),
    require('./players/players-ctrl'),
    require('./profile/profile-ctrl'),
    require('./registration/registration-ctrl')
];

controllerComponents.forEach((currentComponent) => {
    angularModule.controller(currentComponent.default.name, currentComponent.default.fn);
});

module.exports = angularModule;
