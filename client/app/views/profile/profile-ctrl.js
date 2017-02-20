/* @ngInject */
function ProfileCtrl($rootScope, $state, $http, $location, ApiService) {
    const vm = this;

    function isOwnProfile() {
        if ($rootScope.user) {
            vm.own = true;
        }
    }
    isOwnProfile();

    $rootScope.$on('loggedin', (e) => {
        isOwnProfile();
    });

    const username = $location.url().split('/')[2];

    ApiService.getProfile(username)
    .then((profile) => {
        vm.player = profile.data;
        vm.title = profile.data.username ? profile.data.username: `${profile.data.first} ${profile.data.last}`;
    });

    // Allow repeat per rating amount
    vm.stars = stars => new Array(stars);

    vm.edit = () => {
        $state.transitionTo('frame.editprofile');
    };
}

export default {
    name: 'ProfileCtrl',
    fn:   ProfileCtrl
};
