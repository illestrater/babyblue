/* @ngInject */
function PlayersCtrl($rootScope, $scope, $http, $log, ApiService) {
    const vm = this;

    ApiService.getPlayers()
    .then((players) => {
        vm.players = players.data;
    });

    vm.search = (player) => {
        let team = '';
        if (player.team !== undefined) {
            team = angular.lowercase(player.team).indexOf(vm.query || '') !== -1;
        }
        return (angular.lowercase(player.first).indexOf(vm.query || '') !== -1 ||
                angular.lowercase(player.last).indexOf(vm.query || '') !== -1 ||
                angular.lowercase(player.username).indexOf(vm.query || '') !== -1 ||
                team);
    };

    vm.clearSearch = () => {
        vm.query = undefined;
    };
}

export default {
    name: 'PlayersCtrl',
    fn:   PlayersCtrl
};
