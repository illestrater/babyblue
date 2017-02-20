import frameView  from '../views/frame/frame-view.html';
import homeView  from '../views/home/home-view.html';
import playersView  from '../views/players/players-view.html';
import registrationView  from '../views/registration/registration-view.html';

/* @ngInject */
function OnConfig($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $facebookProvider) {
    $stateProvider
    .state('frame', {
        controller:  'FrameCtrl as vm',
        templateUrl: frameView,
        title:       'FrameCtrl'
    })
    .state('frame.home', {
        url:         '/home',
        controller:  'HomeCtrl as vm',
        templateUrl: homeView,
        title:       'HomeCtrl'
    })
    .state('frame.players', {
        url:         '/players',
        controller:  'PlayersCtrl as vm',
        templateUrl: playersView,
        title:       'PlayersCtrl'
    })
    .state('frame.registration', {
        url:         '/registration',
        controller:  'RegistrationCtrl as vm',
        templateUrl: registrationView,
        title:       'RegistrationCtrl'
    });

    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('light-blue');
    $facebookProvider.setVersion('v2.7');
    $facebookProvider.setAppId(666240756840659);
    // $facebookProvider.setAppId(1624151074569789);
    $facebookProvider.setPermissions('email, public_profile');
}

export default OnConfig;
