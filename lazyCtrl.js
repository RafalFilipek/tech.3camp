angular.module('lazyModule')
.controller('LazyCtrl', function(data, $scope) {
	this.data = data
	return this
})
