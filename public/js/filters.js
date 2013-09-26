angular.module('mean.filters', [])
.filter('removeZeros', function() {
  return function(rating) {
    if (rating > 0) {
      return rating;
    } else {
      return '';
    }
  };
})
.filter('priceRateFormat', function() {
  return function(priceRating) {
    var rating = '';
    for (var i = 0; i < priceRating; i++) {
      rating += '$';
    }
    return rating;
  };
});