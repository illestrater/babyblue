const angularModule = angular.module('app.filters', []);

const components = [];

components.forEach((currentComponent) => {
    angularModule.directive(currentComponent.default.name, currentComponent.default.fn);
});

module.exports = angularModule;
