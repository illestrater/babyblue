const angularModule = angular.module('app.directives', []);

const components = [
    require('./first/first-ctrl'),
];

components.forEach((currentComponent) => {
    angularModule.directive(currentComponent.default.name, currentComponent.default.fn);
});

module.exports = angularModule;
