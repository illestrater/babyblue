import firstView from './first-view.html';

/* @ngInject */
function FirstCtrl($scope, $state, $timeout, $log) {
    const infoViewVm = this;

    return infoViewVm;
}
function first() {
    return {
        restrict:     'E',
        controller:   FirstCtrl,
        controllerAs: 'firstViewVm',
        templateUrl:  firstView
    };
}

export default {
    name: 'firstModal',
    fn:   first
};
