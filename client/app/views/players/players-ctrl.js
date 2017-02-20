/* @ngInject */
function PlayersCtrl($rootScope, $scope, $http, $log, ApiService) {
    const vm = this;

    ApiService.getPlayers()
    .then((players) => {
        vm.players = players.data;
        console.log(vm.players);
    });
}

export default {
    name: 'PlayersCtrl',
    fn:   PlayersCtrl
};
