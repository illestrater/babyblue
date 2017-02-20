const angularModule = angular.module('app.services', []);

const components = [
    require('./api-service'),
    require('./facebook-service')
];

components.forEach((currentComponent) => {
    angularModule.service(currentComponent.default.name, currentComponent.default.fn);
});

module.exports = angularModule;
