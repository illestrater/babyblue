import cookies from 'js-cookie';

/* @ngInject */
function RegistrationCtrl($rootScope, $http, $state, $log, ApiService) {
    const vm = this;

    vm.user = {};
    vm.player = {};
    vm.error = '';

    $rootScope.$on('loggedin', (e) => {
        $state.transitionTo('frame.home');
    });

    function loginSucceeded(user) {
        $rootScope.user = user.data.user;
        $http.defaults.headers.common.authorization = user.data.token;
        cookies.set('jwt', user.data.token);
        $state.transitionTo('frame.home');
    }

    vm.register = () => {
        if (!(vm.user.first && vm.user.last && vm.user.email && vm.user.password && vm.user.password2)) {
            vm.error = 'Please fill out all basic information';
        } else if (!vm.terms) {
            vm.error = 'Please read the terms and agreements';
        } else if (vm.user.password !== vm.user.password2) {
            vm.error = 'Your passwords did not match';
        } else {
            vm.error = '';
            ApiService.register(vm.user)
            .then((user) => {
                if (user.data.length !== 0) {
                    loginSucceeded(user);
                }
            });
        }
    };
}

export default {
    name: 'RegistrationCtrl',
    fn:   RegistrationCtrl
};
