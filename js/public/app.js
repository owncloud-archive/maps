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

angular.module('Map').controller('MainController',
	['$scope', '$rootScope', '$routeParams', '$http',
function ($scope, $rootScope, $routeParams, $http) {
	$scope.showNavBar = function () {
		$scope.is_show_panel = false;
		$scope.is_show_nav = true;
	};

	$scope.hideNavBar = function () {
		$scope.is_show_panel = true;
		$scope.is_show_nav = false;
	};

	$scope.toggleSearchBar = function () {
		$scope.is_show_search = !$scope.is_show_search;
	};

	$scope.is_show_panel = true;
	$scope.is_show_nav = !$scope.is_show_panel;
	$scope.is_show_search = !$scope.is_show_panel;
	//$scope.is_show_search = true;

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
		}
	};

}]);

angular.module('Map').controller('MapController',
	['$scope',
function ($scope) {
	$scope.defaults = {
		//tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
		tileLayerOptions: {
			opacity: 0.9,
			detectRetina: true,
			reuseTiles: true,
		}
	};

	$scope.center = {
		lat: 51.505,
		lng: -0.09,
		zoom: 8
	};

	$scope.bounds = [];

	$scope.main_marker = {
		lat: 51.405,
		lng: -0.09,
		focus: true,
		draggable: true,
	};

	var _setMainMarker = function () {
		$scope.markers.__main_marker = $scope.main_marker;
	};

	$scope.markers = {};
	_setMainMarker();

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
		// hrm, we have to always reset main marker because of the way
		// leaflet directive handles multi markers
		_setMainMarker();
	});

}]);

angular.module('Map').controller('PointController',
	['$scope', '$rootScope', 'PointBusinessLayer',
function ($scope, $rootScope, PointBusinessLayer) {
	var point_bl = PointBusinessLayer;

	$scope.showPointCollectionOnMap = function (collection_name) {
		$rootScope.$broadcast(
			'displayMultiMarkers',
			$scope.collections[collection_name].points);
	};

	$scope.pointBusinessLayer = point_bl;
	$scope.collections = point_bl.getCollections();

}]);

angular.module('Map').factory('PointBusinessLayer',
['PointModel',
function (PointModel) {
	var collections = {
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
	var _getPointsByCollection = function (collection) {
		return PointModel.getByCollection(collection);
	};

	var _getCollections = function () {
		return collections;
	};

	return {
		getPointsByCollection: _getPointsByCollection,
		getCollections: _getCollections,
	};
}]);

angular.module('Map').factory('PointModel',
[
function () {
	var points = {
		'favorite': [
			{
				'title': 'London',
				'coordinate': [51.505, -0.09],
			},
		],
	};

	var _getByCollection = function (collection) {
		return points[collection];
	};

	return {
		getByCollection: _getByCollection,
	};
}]);

angular.module('Map').factory('Publisher',
['_Publisher', 'PointModel',
function (_Publisher, PointModel) {
	publisher = new _Publisher();

	publisher.subscribeObjectTo(PointModel, 'points');

	return publisher;
}]);

})(angular, jQuery);