angular.module('mean.filters', [])
.filter('priceRateFormat', function() {
  return function(priceRating) {
    var rating = '';
    for (var i = 0; i < priceRating; i++) {
      rating += '$';
    }
    return rating;
  };
});