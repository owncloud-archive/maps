(function(angular, $, undefined){

'use strict';

angular.module('Map', ['OC', 'leaflet-directive']).
	config(
		['$routeProvider', '$interpolateProvider',
		function ($routeProvider, $interpolateProvider) {

	$routeProvider.when('/', {
		templateUrl: 'main.html',
		controller: 'MainController'
	}).when('/:id', {
		templateUrl: 'main.html',
		controller: 'MainController'
	}).otherwise({
		redirectTo: '/'
	});

	// because twig already uses {{}}
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
}]);

angular.module('Map').controller('CollectionController',
	['$scope', '$rootScope', 'CollectionBussinessLayer',
function ($scope, $rootScope, CollectionBussinessLayer) {
	var collection_bl = CollectionBussinessLayer;

	$scope.collectionBussinessLayer = collection_bl;

	$scope.$on('cleanCollection', function() {
		collection_bl.setActive(null);
	});
}]);

angular.module('Map').controller('MainController',
	['$scope', '$rootScope', '$routeParams', '$http',
function ($scope, $rootScope, $routeParams, $http) {
	$scope.is_show_nav = false;
	$scope.is_show_search = false;
	//$scope.is_show_search = true;
	//$scope.is_show_nav = true;

	$scope.showNavBar = function () {
		$scope.is_show_nav = true;
	};

	$scope.hideNavBar = function () {
		$scope.is_show_nav = false;
	};

	$scope.toggleSearchBar = function () {
		$scope.is_show_search = !$scope.is_show_search;
	};

	$scope.searchByAddress = function () {
		var address = $scope.search_keyword;
		if (address !== '') {
			var req_url = '//open.mapquestapi.com/nominatim/v1/search?' +
				'format=json' + '&q=' + address;
			$http({method: 'GET', url: req_url}).
				success(function (data, status) {
					var first_re = data[0];
					var boundingbox = first_re.boundingbox;
					var south_west = {
						lat: parseFloat(boundingbox[0]),
						lng: parseFloat(boundingbox[2])
					};
					var north_east = {
						lat: parseFloat(boundingbox[1]),
						lng: parseFloat(boundingbox[3])
					};
					// broadcast event for map controller
					$rootScope.$broadcast('updateFocus', {
						'coordinate': {
							'lat': parseFloat(first_re.lat),
							'lng': parseFloat(first_re.lon),
						},
						'bounds': {
							southWest: south_west,
							northEast: north_east,
						},
					});
				});

			$rootScope.$broadcast('cleanCollection');
		}
	};
}]);

angular.module('Map').controller('MapController',
['$scope', '$rootScope',
function ($scope, $rootScope) {
	$scope.defaults = {
		//tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
		//tileLayerOptions: {
			//opacity: 0.9,
			//detectRetina: true,
			//reuseTiles: true,
		//}
	};

	$scope.center = {
		lat: 51.505,
		lng: -0.09,
		zoom: 8
	};

	$scope.bounds = [];

	$scope.markers = {};

	$scope.main_marker = {
		lat: 51.405,
		lng: -0.09,
		focus: true,
		draggable: true,
	};

	$scope.$on('updateFocus', function (event, message) {
		var coordinate = message.coordinate;
		$scope.main_marker.lat = coordinate.lat;
		$scope.main_marker.lng = coordinate.lng;
		$scope.center.lat = coordinate.lat;
		$scope.center.lng = coordinate.lng;
		$scope.bounds = message.bounds;
	});

	$scope.$on('displayMultiMarkers', function (event, markers) {
		$scope.markers = markers;
	});

	$scope.$on('leafletDirectiveMainMarkerClick', function() {
		$rootScope.$broadcast('ocMapMainMarkerClick', $scope.main_marker);
	});

}]);

angular.module('Map').controller('MarkerPanelController',
['$scope', '$rootScope', '$routeParams', '$http', 'CollectionBussinessLayer',
'PointBusinessLayer',
function ($scope, $rootScope, $routeParams, $http, CollectionBussinessLayer,
PointBusinessLayer) {
	var collection_bl = CollectionBussinessLayer;
	var point_bl = PointBusinessLayer;
	//$scope.is_show_main_marker_panel = false;
	$scope.is_show_main_marker_panel = true;
	$scope.is_show_add_main_marker_form = true;
	$scope.collectionBussinessLayer = collection_bl;

	$scope.$on('ocMapMainMarkerClick', function(event, main_marker) {
		$scope.is_show_main_marker_panel = !$scope.is_show_main_marker_panel;
		$scope.new_point_info = {
			lat: main_marker.lat,
			lng: main_marker.lng,
		};
	});

	$scope.closeMainMarkerPanel = function() {
		$scope.is_show_main_marker_panel = false;
	};

	$scope.showAddMainMarkerForm = function() {
		$scope.is_show_add_main_marker_form = true;
	};

	$scope.submitAddMainMarkerForm = function() {
		$scope.is_show_add_main_marker_form = false;
		if (!angular.isDefined($scope.new_point_info.lat) ||
			!angular.isDefined($scope.new_point_info.lng)) {
			console.log('error: no main marker info!!!');
			return;
		}
		// @TODO check user input here!  18.07 2013 (houqp)
		point_bl.addPointToCollection(
				$scope.new_point_name, $scope.new_point_info, $scope.selected_collection);
		$scope.is_show_main_marker_panel = false;
	};
}]);

angular.module('Map').controller('PointController',
['$scope', '$rootScope', 'PointBusinessLayer',
function ($scope, $rootScope, PointBusinessLayer) {
	var point_bl = PointBusinessLayer;

	$scope.active_points = {};

	$scope.$on('setCollectionActive', function (event, collection_name) {
		if (collection_name === null) {
			$scope.active_points = {};
		} else {
			$scope.active_points = point_bl.getPointsByCollection(collection_name);
		}
		$rootScope.$broadcast('displayMultiMarkers', $scope.active_points);
	});

	$scope.pointBusinessLayer = point_bl;

}]);

angular.module('Map').factory('CollectionBussinessLayer',
['$rootScope',
function ($rootScope) {
	var active_collection = null;
	var collections = {
		'favorite': {
			'description': 'my favorite places'
		},
		'good restaurants': {
		}
	};

	var cbl = {};

	cbl.setActive = function (collection_name) {
		if (!collection_name) {
			active_collection = null;
			$rootScope.$broadcast('setCollectionActive', null);
		} else {
			if (!(collection_name in collections)) {
				return;
			}

			$rootScope.$broadcast('setCollectionActive', collection_name);
			active_collection = collection_name;
		}
	};

	cbl.getAll = function () {
		return collections;
	};

	cbl.isActive = function (collection_name) {
		return (active_collection == collection_name);
	};

	return cbl;
}]);

angular.module('Map').factory('PointBusinessLayer',
['PointModel',
function (PointModel) {
	var pbl = {};

	pbl.getPointsByCollection = function (collection) {
		return PointModel.getByCollection(collection);
	};

	pbl.addPointToCollection = function (point_name, point_data, collection_name) {
		return PointModel.addPointToCollection(point_name, point_data, collection_name);
	};

	return pbl;
}]);

angular.module('Map').factory('PointModel',
[
function () {
	var points = {
		'favorite': {
			'points': {
				m1: {
					lat: 51.505,
					lng: -0.09,
					message: "test favorite mark 1"
				},
				m2: {
					lat: 51,
					lng: 0,
					message: "test favorite mark 2",
				}
			},
		},
		'good restaurants': {
			'points': {
				m1: {
					lat: 51.805,
					lng: -0.09,
					message: "test restaurants mark 1"
				},
				m2: {
					lat: 52,
					lng: 0,
					message: "test restaurants mark 2",
				},
				m3: {
					lat: 51.7,
					lng: 0.02,
					message: "test restaurants mark 2",
				}
			},
		}
	};

	var pmodel = {};

	pmodel.getByCollection = function (collection) {
		return points[collection].points;
	};

	pmodel.addPointToCollection = function (point_name, point_data, collection_name) {
		points[collection_name].points[point_name] = point_data;
	};

	return pmodel;
}]);

angular.module('Map').factory('Publisher',
['_Publisher', 'PointModel',
function (_Publisher, PointModel) {
	publisher = new _Publisher();

	publisher.subscribeObjectTo(PointModel, 'points');

	return publisher;
}]);

})(angular, jQuery);