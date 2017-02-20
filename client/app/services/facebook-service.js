import cookie from 'js-cookie';

/* @ngInject */
function FacebookService($facebook, $rootScope, AppSettings, ApiService) {
    const service = {
        width:  null,
        height: null
    };

    service.logout = () => {
        cookie.set('facebook', false);
    };

    service.login = () => {
        cookie.set('facebook', true);
        return $facebook.login();
    };

    service.getStatus = () => {
        const status = new Promise((resolve, reject) => {
            $facebook.getLoginStatus().then((res) => {
                if (res.status === 'connected' && cookie.get('facebook')) {
                    $facebook.api('/me', {
                        fields: 'first_name, last_name, email'
                    }).then((response) => {
                        console.log('Facebook logged in:', response);
                        if (!response || response.error) {
                            reject(response);
                        } else {
                            ApiService.getUser(response.id)
                            .then((user) => {
                                if (user.data.length !== 0) {
                                    $rootScope.user = user.data.user;
                                }
                                ApiService.setAuthHeader(user.data.token);
                                cookie.set('jwt', user.data.token);
                                cookie.set('facebook', true);
                                user.info = response;
                                resolve(user);
                            }, (err) => {
                                const user = {
                                    data: [],
                                    info: response
                                };
                                resolve(user);
                            });
                        }
                    });
                } else {
                    resolve(false);
                }
            });
        });
        return status;
    };

    return service;
}

export default {
    name: 'FacebookService',
    fn:   FacebookService
};
