angular.module('lazyModule', ['ui.router'])
.config(function($stateProvider) {
	$stateProvider.state('app.demo-oc.lazy', {
		'url': '/lazy',
		'views': {
			'@app': {
				'templateUrl': 'views/demos/lazy.html',
				'controllerAs': 'lazy',
				'controller': 'LazyCtrl'
			}
		},
		'resolve': {
			'data': function(lazyFactory) {
				return lazyFactory.data
			}
		}
	})
})
