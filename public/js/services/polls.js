//Polls service used for polls REST endpoint
angular.module('mean.polls').factory("Polls", ['$resource', function($resource) {
  return $resource('polls/:pollId', {
    pollId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);