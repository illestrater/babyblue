import cookie from 'js-cookie';
/* eslint-disable */
/* @ngInject */
function OnRun($rootScope, AppSettings, ApiService, FacebookService) {
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

    const jwt = cookie.get('jwt');
    if (jwt !== undefined) {
        ApiService.getUser(jwt)
        .then((user) => {
            ApiService.setAuthHeader(jwt);
            if (user.data.length === 0) {
                $rootScope.user = undefined;
            }
            $rootScope.user = user.data.user;
            $rootScope.$broadcast('loggedin');
        });
    } else {
        FacebookService.getStatus()
        .then((res) => {
            if (res.data === undefined) {
                $rootScope.user = undefined;
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}

export default OnRun;
