angular.module('mean.directives', [])
.directive('pollChoices', function() {
  return {
    template: '<input type="text" ng-model="choice" placeholder="Your choices" />',
    link: function(scope, ele, attrs, ctrl) {
      //scope.$watch
    }
  };
});