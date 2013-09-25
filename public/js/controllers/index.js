angular.module('mean.system').controller('IndexController', ['$scope', 'Global', function ($scope, Global) {
  $scope.global = Global;

  $scope.getStartedLink = function() {
    if ($scope.global.user) {
      return '#!/polls/create';
    } else {
      return 'signin';
    }
  };

}]);