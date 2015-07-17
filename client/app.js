var app = angular.module('app', ['ui.router', 'ngTouch', 'ngMaterial']);

app.config(['$stateProvider','$urlRouterProvider', '$locationProvider', '$mdThemingProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/pages/home.html',
      controller: 'HomeController'
    })
  
    .state('registration', {
      url: '/registration',
      templateUrl: '/pages/registration.html',
      controller: 'RegistrationController'
    })
  
    .state('players', {
      url: '/players',
      templateUrl: '/pages/players.html',
      controller: 'PlayersController'
    })
  
    .state('rules', {
      url: '/rules',
      templateUrl: '/pages/rules.html',
      controller: 'RulesController'
    });
  
  $urlRouterProvider.otherwise('home');
  
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('light-blue');
}]);

app.controller('MainController', ['$scope', '$timeout', '$state', '$location', '$window', '$http', function ($scope, $timeout, $state, $location, $window, $http) {
    
  $scope.loadPage = function(route) {
    $state.go(route);
  }
  
  // Check if logged in | login corner control
  $scope.logged = 'no';
  var res = $http.get('/loggedin');
  res.success(function(data, statuc, headers, config) {
    if(data.user){
      $scope.username = data.user.nickname ? data.user.nickname : data.user.first + " " + data.user.last;
      $scope.welcome = "WELCOME";
      $scope.username = $scope.username;
      var result = document.getElementsByClassName("login-decoration");
      var element = angular.element(result).css({"margin-top":"40px", "border-left":"solid #56A0D3", "border-right":"solid #56A0D3"});
      $scope.logged = 'yes';
    }
  });
  
  // Login functionality w/ alert banner
  $scope.login = function() {
    var result = document.getElementById("info-banner");
    var element = angular.element(result);
    
    if($scope.email !== undefined && $scope.pass !== undefined){
      var info = {email: $scope.email, password: $scope.pass};
      var res = $http.post('/login', info);
      res.success(function(data, status, headers, config){
        $location.path('/players');
        $window.location.reload();
      });
      res.error(function(data, status, headers, config) {
        $scope.info = data;
      });
    } else {
      $scope.info = "Please do not leave any fields blank";
    }
    
    element.removeClass("info-animation");
    result.offsetWidth = result.offsetWidth;
    element.addClass("info-animation");
  }
  
  $scope.facebook = function() {
    $window.location.href = "/oauth/facebook";
  }
  
  $scope.logout = function() {
    var res = $http.get('/logout');
    res.success(function(data, status, headers, config){
      $window.location.reload();
    });
  }

}]);

app.controller('HomeController', ['$scope', '$timeout', '$state', '$http', function ($scope, $timeout, $state, $http) {


}]);

app.controller('RegistrationController', ['$scope', '$state', '$http', '$window', '$location', function ($scope, $state, $http, $window, $location) {
  
  $scope.user = { first: "", last: "", email: "", nickname: "", password: "", password2: "" };
  $scope.player = { handling: "", endurance: "", quickness: "", height: "", shooting: "", power: "", bio: ""};
  $scope.error = "";
  
  $location.url('/registration');
  
  // If already logged in, redirect to home
  var res = $http.get('/loggedin');
  res.success(function(data, statuc, headers, config) {
    if(data.user){
      $state.go('home');
    }
  });
  
  // Get FB data
  var res = $http.get('/session');
  res.success(function(data, status, headers, config){
    $scope.user.first = data.first;
    $scope.user.last = data.last;
    $scope.user.email = data.email;
    $scope.user.provider = data.provider;
    $scope.user.providerId = data.providerId;
  });
  
  // Form functionality
  $scope.register = function(){
    if(!($scope.user.first && $scope.user.last && $scope.user.email && $scope.user.password && $scope.user.password2)){
      $scope.error = "Please fill out all basic information";
    } else if(!$scope.terms) {
      $scope.error = "Please read the terms and agreements";
    } else if($scope.user.password != $scope.user.password2){
      $scope.error = "Your passwords did not match";
    } else {
      $scope.error = "";
      var data = { user: $scope.user, player: $scope.player, provider: $scope.user.provider, providerId : $scope.user.providerId };
      var res = $http.post('/registeruser', data);
      res.success(function(data, status, headers, config) {
        $location.path('/players');
        $window.location.reload();
      });
      res.error(function(data, status, headers, config) {
        $scope.error = data.error;
      });
    }
  }
  
}]);

app.controller('PlayersController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  
  $location.url('/players');
  
  var res = $http.get('/getplayers');
  res.success(function(data, status, headers, config){
    $scope.players = data;
  });
  
}]);

app.controller('RulesController', ['$scope', '$http', function ($scope, $http) {
  
  var res = $http.get('/getplayers');
  res.success(function(data, status, headers, config){
    $scope.players = data;
  });
  
}]);