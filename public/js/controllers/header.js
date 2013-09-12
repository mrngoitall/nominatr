angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Polls",
        "link": "polls"
    }, {
        "title": "Create New Poll",
        "link": "polls/create"
    }];
}]);