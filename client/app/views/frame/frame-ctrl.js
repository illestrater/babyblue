import cookies from 'js-cookie';

/* @ngInject */
function FrameCtrl($rootScope, $scope, $http, $state, $timeout, $log, AppSettings) {
    const vm = this;

    vm.logo = require('app/assets/images/logo-white.png'); // eslint-disable-line

    $rootScope.$on('loggedin', (e) => {
        $state.transitionTo('frame.home');
    });

    vm.logout = () => {
        cookies.remove('jwt');
        $http.defaults.headers.common.authorization = undefined;
        $rootScope.user = undefined;
        $state.transitionTo('frame.home');
    };

    vm.loadPage = (view) => {
        $state.transitionTo(`frame.${view}`);
    };
}

export default {
    name: 'FrameCtrl',
    fn:   FrameCtrl
};
