/* @ngInject */
function ApiService($rootScope, $http, AppSettings) {
    const service = {};

    service.setAuthHeader = (jwt) => {
        $http.defaults.headers.common.authorization = jwt;
    };

    service.getUser = jwtOrId => $http.get(`${AppSettings.baseURL}/get-user/${jwtOrId}`);
    service.register = user => $http.post(`${AppSettings.baseURL}/register`, user);
    service.getPlayers = user => $http.get(`${AppSettings.baseURL}/get-players`);

    return service;
}

export default {
    name: 'ApiService',
    fn:   ApiService
};
