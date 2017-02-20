/* @ngInject */
function EditProfileCtrl($rootScope, $scope, $http, $log, ApiService) {
    const vm = this;

    // Get profile information and populate
    var res = $http.get('/loggedin');
    res.success(function(logged, status, headers, config) {
      if(logged){
        var res = $http.post('/getprofile', {id: logged.id});
        res.success(function(data, status, headers, config) {
          $scope.user = { first: data.user.first, last: data.user.last, email: data.user.email, nickname: data.user.nickname };
          $scope.player = { handling: data.player.handling, endurance: data.player.endurance, quickness: data.player.quickness, height: data.player.height, shooting: data.player.shooting, power: data.player.power, bio: data.player.bio};
          $scope.team = data.team;
          $scope.teamId = data.teamId;
          $scope.id = data.id;
        });
      } else {
        $state.go('home');
      }
    });

    var res = $http.get('/teamlist');
    res.success(function(data, status, headers, config) {
      $scope.teamlist = data;
    });

    $scope.clearTeam = function() {
      $scope.teamSelect = undefined;
    }

    $scope.error = "";

    // Save Button
    $scope.save = function(){
      if(!($scope.user.first && $scope.user.last)){
        $scope.error = "Please fill out all basic information";
      } else {
        var postData = { user: $scope.user, player: $scope.player, team: $scope.team, teamId: $scope.teamId };

        // Team Management
        if($scope.teamSelect){
          var player = {name: $scope.teamSelect, players: $scope.id};
        } else if(!$scope.teamSelect && $scope.teamCreate){
          var team = {name: $scope.teamCreate, captain: $scope.id, playername: $scope.user.first + " " + $scope.user.last, playerid: $scope.id};
          var res = $http.post('/createteam', team);
          res.success(function(team, status, headers, config) {
            postData.team = team.name;
            postData.teamId = team._id;
            var res = $http.post('/updateuser', postData);
            res.success(function(data, status, headers, config) {
              $scope.error = "Updated and created team.";
            });
            res.error(function(data, status, headers, config) {
              $scope.error = team.error;
            });
          });
          res.error(function(team, status, headers, config) {
            $scope.error = team.error;
          });
        }

        var res = $http.post('/updateuser', postData);
        res.success(function(data, status, headers, config) {
          $location.path('/profile/' + $scope.id);
        });
        res.error(function(data, status, headers, config) {
          $scope.error = data.error;
        });
      }
    }
}

export default {
    name: 'EditProfileCtrl',
    fn:   EditProfileCtrl
};
