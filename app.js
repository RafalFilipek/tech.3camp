(function() {


	angular.module('app', ['ngMaterial', 'ui.router', 'oc.lazyLoad'])


	.config(function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

		$ocLazyLoadProvider.config({debug: true, events: true})

		/**
		 * Żadnego migania.
		 */
		$stateProvider
		.state('app', {
			'url': '',
			'templateUrl': 'views/app.html'
		})


		/** DEMO OC - START */


		.state('app.demo-oc',  {
			'url': '/demo/oc',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-1.html'
			},
			'controller': 'Demo1Controller',
			'controllerAs': 'demo'
		})


		/** DEMO UI - START */

		.state('app.demo-ui',  {
			'url': '/demo/ui',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-2.html'
			},
			'controller': 'Demo2Controller',
			'controllerAs': 'demo',
		})



		.state('app.demo-ui.versions', {
			'url': '/version/:version',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-2-' + $stateParams.version + '.html'
			},
		})
		.state('app.demo-ui.versions.page', {
			'url': '/page/:page',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-2-' + $stateParams.version + '-' + $stateParams.page + '.html'
			}
		})




		.state('app.demo-ui.versions.states', {
			abstract: true,
			'views': {
				'list': {
					'templateUrl': 'views/demos/demo-2-2-a.html'
				}
			}
		})

		.state('app.demo-ui.versions.states.list', {
			'url': '/state/list',
		})

		.state('app.demo-ui.versions.states.state', {
			'url': '/state/:state',
			'views': {
				'rest@app.demo-ui.versions': {
					'templateUrl': 'views/demos/demo-2-2-b.html'
				}
			}
		})


		/** DEMO REACT - START */


		.state('app.demo-react',  {
			'url': '/demo/react',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-3.html'
			},
			'controller': 'Demo3Controller',
			'controllerAs': 'demo',
		})


		/** DEMO MODEL - START */

		.state('app.demo-model', {
			'url': '/demo-model',
			'templateUrl': function($stateParams) {
				return 'views/demos/demo-4.html'
			},
			'controllerAs': 'demo',
			'controller': function() {
				var vm = this;
				vm.addToList = function(collection) {
					collection.push({})
				}
				vm.model = {
					'fname': 'Rafał',
					'lname': 'Filipek',
					'mails': [
						{'value':'rafal.filipek@ukryjto-1.pl'},
						{},
						{'value':'rafal.filipek@ukryjto-2.pl'},
						{'value':'rafal.filipek@ukryjto-3.pl'}

					]
				}
			}
		})

		$urlRouterProvider.otherwise('/')
	})
	.run(function run($rootScope, $state, $interpolate, $compile, $parse) {
		$rootScope.$state = $state
		$rootScope.math = Math
		window.p = $parse
		window.i = $interpolate
		window.c = $compile
	})
	.controller('Demo1Controller', function Demo1Controller($ocLazyLoad) {
		var vm = this
		vm.has = undefined
		vm.check = function() {
			try {
				angular.module('lazyModule')
				vm.has = true
			} catch(e) {
				console.info(e)
				vm.has = false
			}
		}
		vm.load = function () {
			$ocLazyLoad.load({
				'name': 'lazyModule',
				'files': ['lazyModule.js', 'lazyFactory.js', 'lazyCtrl.js']
			}).then(function() {
				vm.has = true
				vm.activeView = true
			})
		}
		return vm
	})


	.value('list', {'count': 120})
	.controller('Demo2Controller', function Demo2Controller($animate, $scope, list) {
		var vm = this
		vm.count = list.count
		vm.items = []
		$animate.enabled(false)
		$scope.$on('$destroy', function() {
			$animate.enabled(true)
		})
		version = 1
		vm.render = function() {
			delete vm.items
			vm.items = []
			console.time('generate')
			for (var i = 0; i < vm.count; i++) {
				vm.items.push({
					'i': (vm.items.length + 1) * version,
					'random': Math.random(),
					'bool': Math.random() > 0.5
				})
			};
			console.timeEnd('generate')
			version++
		}
		vm.add = function() {
			vm.getIndex = vm.addCount - 1
			for (var i = 0; i < vm.addCount; i++) {
				vm.items.unshift({
					'i': (vm.items.length + 1) * version,
					'random': Math.random(),
					'bool': Math.random() > 0.5
				})
			}
			version++
		}
		return this;
	})
	.directive('getStartTime', function() {
		return {
			'require': '^ngController',
			'link': function(scope, el, attrs, ctrl) {
				if (scope.$first) {
					if (attrs.name) {
						if (!ctrl.renders) {
							ctrl.renders = {}
						}
						ctrl.renders[attrs.name] = {}
						ctrl.renders[attrs.name].start = (new Date()).getTime()
					} else {
						ctrl.renderStart = (new Date()).getTime()
					}
				}
			}
		}
	})
	.directive('getEndTime', function() {
		return {
			'require': '^ngController',
			'link': function(scope, el, attrs, ctrl) {
				if (ctrl.getIndex === scope.$index || (!ctrl.getIndex && scope.$last)) {
					scope.$applyAsync(function() {
						if (attrs.name) {
							ctrl.renders[attrs.name].end = (new Date()).getTime()
						} else {
							ctrl.renderEnd = (new Date()).getTime()
						}
					})
				}
			}
		}
	})
	.controller('Demo3Controller', 	function Demo3Controller(phonebook, getWatchers) {
		var vm = this
		vm.phonebook = phonebook
		vm.getWatchers
		return vm
	})
	.value('getWatchers', function getWatchers(root) {
		root = angular.element(root || document.documentElement);
		var watcherCount = 0;
		function getElemWatchers(element) {
			var isolateWatchers = getWatchersFromScope(element.data().$isolateScope || element.data().$isolateScopeNoTemplate);
			var scopeWatchers = getWatchersFromScope(element.data().$scope);
			var watchers = scopeWatchers.concat(isolateWatchers);
			angular.forEach(element.children(), function (childElement) {
				watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
			});
			return watchers;
		}

		function getWatchersFromScope(scope) {
			if (scope) {
				return scope.$$watchers || [];
			} else {
				return [];
			}
		}
		return getElemWatchers(root);
	})
	.directive('reactRenderer', function() {
		var List = React.createClass({
			render: function() {
				var elements = this.props.data.map(function(contact) {
					return React.createElement("p", null,
							contact.fname, " ", contact.lname,
							React.createElement("br", null),
							React.createElement("small", null,
								React.createElement("strong", null, "email: "), contact.email
							),
							React.createElement("br", null),
							React.createElement("small", null,
								React.createElement("strong", null, "phone: "), contact.phone
							),
							React.createElement("hr", null)
						)

				})
				return React.createElement("div", {'className': 'List'}, elements)
			}
		});
		return {
			'scope': {
				'data': '='
			},
			'require': '^ngController',
			'link': function(scope, element, attrs, ctrl) {
				var node = element[0]
				function render() {
					if (!ctrl.renders) {
						ctrl.renders = {}
					}
					ctrl.renders['react'] = {}
					ctrl.renders['react'].start = (new Date()).getTime()
					React.renderComponent(React.createElement(List, {'data': scope.data}), node)
					ctrl.renders['react'].end = (new Date()).getTime()
				}
				render()
			}
		}
	})
	.directive('elementInfo', function(getWatchers, $document, $interval) {
		return {
			scope: true,
			'template': [
				'<div>',
				'<p>Watchers: {{watchers}}</p>',
				'<p>Nodes: {{nodes}}</p>',
				'</div>'
			].join(''),
			'link': function(scope, el, attrs) {
				window.$d = $document
				function get() {
					scope.watchers = getWatchers(angular.element(document.querySelector(attrs.target))).length
					scope.nodes = document.querySelector(attrs.target).childNodes.length
				}
				scope.$applyAsync(function() {
					get()
				})
				$interval(get, 1000)
			}
		}
	})
	.factory('phonebook', function() {
		obj = {}
		obj.data = []
		function generate() {
			for (var i = 1000 - 1; i >= 0; i--) {
				obj.data.push({
					'fname': faker.name.firstName(),
					'lname': faker.name.lastName(),
					'phone': faker.phone.phoneNumber(),
					'email': faker.internet.email(),
					'id': i
				})
			};
			console.log(obj.data)
		}
		generate()
		return obj
	})
	.controller('TechController', function TechController ($scope) {
		var vm = this
		vm.progress = 1
		return vm
	})

}())
