//Polls service used for polls REST endpoint
angular.module('mean.polls').factory("Votes", ['$resource', function($resource) {
  return $resource('votes/:pollId', {
    pollId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);