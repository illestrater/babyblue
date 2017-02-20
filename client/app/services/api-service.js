/* @ngInject */
function ApiService($rootScope, $http, AppSettings) {
    const service = {};

    service.setAuthHeader = (jwt) => {
        $http.defaults.headers.common.authorization = jwt;
    };

    service.getUser = jwtOrId => $http.get(`${AppSettings.baseURL}/get-user/${jwtOrId}`);
    service.login = (user, password) => $http.post(`${AppSettings.baseURL}/login`, { user, password });
    service.register = user => $http.post(`${AppSettings.baseURL}/register`, user);
    service.getPlayers = user => $http.get(`${AppSettings.baseURL}/get-players`);
    service.getProfile = username => $http.get(`${AppSettings.baseURL}/get-profile/${username}`);

    return service;
}

export default {
    name: 'ApiService',
    fn:   ApiService
};
