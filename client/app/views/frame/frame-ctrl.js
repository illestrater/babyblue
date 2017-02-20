import cookies from 'js-cookie';

/* @ngInject */
function FrameCtrl($rootScope, $scope, $http, $state, $timeout, $log, ApiService) {
    const vm = this;

    vm.logo = require('app/assets/images/logo-white.png'); // eslint-disable-line

    function loginSucceeded(user) {
        $rootScope.user = user.data.user;
        $http.defaults.headers.common.authorization = user.data.token;
        cookies.set('jwt', user.data.token);
        $state.transitionTo('frame.home');
    }

    vm.login = () => {
        ApiService.login(vm.user, vm.password)
        .then((user) => {
            if (user.data.length !== 0) {
                loginSucceeded(user);
            }
        });
    };

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
