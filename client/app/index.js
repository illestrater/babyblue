import angular     from 'angular';

import onConfig    from './_config/on-config';
import onRun       from './_config/on-run';
import onConstants from './_config/constants';

import './views';
import './services';
import './directives';
import './filters';

import './assets/styles/main.scss';
import '../../node_modules/ng-facebook/ngFacebook';
import '../../node_modules/angular-material/angular-material.css';

const angularModuleRequires = [
    require('angular-material'),
    require('angular-ui-router'),
    'ngFacebook',
    'app.views',
    'app.services',
    'app.directives',
    'app.filters'
];

angular.module('app', angularModuleRequires);

angular.module('app').constant('AppSettings', onConstants);
angular.module('app').config(onConfig);
angular.module('app').run(onRun);

require('es6-promise').polyfill();

// eslint-disable-next-line
angular.bootstrap(document, ['app'], {
    strictDi: true
});
