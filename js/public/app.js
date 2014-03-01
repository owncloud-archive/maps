
angular.module('Maps', ['OC', 'leaflet-directive']).
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

angular.module('Maps').controller('CollectionController',
	['$scope', '$rootScope', 'CollectionBussinessLayer',
function ($scope, $rootScope, CollectionBussinessLayer) {
	var collection_bl = CollectionBussinessLayer;

	$scope.collectionBussinessLayer = collection_bl;

	$scope.$on('cleanCollection', function() {
		collection_bl.setActive(null);
	});
}]);

angular.module('Maps').controller('MainController',
['$scope', '$rootScope', '$routeParams', '$http', 'MapQuest',
function ($scope, $rootScope, $routeParams, $http, MapQuest) {
	$scope.is_show_nav = false;
	//$scope.is_show_search = false;
	$scope.is_show_search = true;
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
		if (address && address !== '') {
			MapQuest.search(address).
				success(function (data, status) {
					$rootScope.$broadcast('searchSuccess', data);
				});
		}
	};

	$scope.search_complete_source = ['abc', 'cba'];
}]);

angular.module('Maps').controller('MapController',
['$scope', '$rootScope',
function ($scope, $rootScope) {
	var main_marker_key = '_main_marker';

	$scope.defaults = {
		zoomControlPosition: 'topright',
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

	$scope.main_marker = {
		lat: 51.405,
		lng: -0.09,
		focus: true,
		draggable: true,
		enable: ['click'],
	};

	$scope.markers = {};
	$scope.markers[main_marker_key] = $scope.main_marker;

	$scope.$on('updateFocus', function (event, message) {
		var coordinate = message.coordinate;
		$scope.main_marker.lat = coordinate.lat;
		$scope.main_marker.lng = coordinate.lng;
		$scope.center.lat = coordinate.lat;
		$scope.center.lng = coordinate.lng;
		$scope.bounds = message.bounds;
	});

	$scope.$on('displayMultiMarkers', function (event, markers) {
		if (!markers) {
			// we show main marker again if collection is cleared
			markers = {};
			markers[main_marker_key] = $scope.main_marker;
		}
		$scope.markers = markers;
	});

	$scope.$on('leafletDirectiveMarker.click', function(ev, marker) {
		if (marker.markerName == main_marker_key)
			$rootScope.$broadcast('ocMapMainMarkerClick', $scope.main_marker);
	});

}]);

angular.module('Maps').controller('MarkerPanelController',
['$scope', '$rootScope', '$routeParams', '$http', 'CollectionBussinessLayer',
'PointBusinessLayer',
function ($scope, $rootScope, $routeParams, $http, CollectionBussinessLayer,
PointBusinessLayer) {
	var collection_bl = CollectionBussinessLayer;
	var point_bl = PointBusinessLayer;

	var popupInit = function() {
		$scope.is_show_main_marker_panel = false;
		$scope.is_show_add_main_marker_form = false;
		$scope.collectionBussinessLayer = collection_bl;
		$scope.is_show_selection_collection = true;
	};

	popupInit();
	//$scope.is_show_main_marker_panel = true;

	$scope.$on('ocMapMainMarkerClick', function(event, main_marker) {
		$scope.is_show_main_marker_panel = !$scope.is_show_main_marker_panel;
		$scope.new_point_info = {
			lat: main_marker.lat,
			lng: main_marker.lng,
		};
	});

	$scope.closeMainMarkerPanel = function() {
		popupInit();
	};

	$scope.showAddMainMarkerForm = function() {
		$scope.is_show_add_main_marker_form = true;
	};

	$scope.hideAddMainMarkerForm = function() {
		$scope.is_show_add_main_marker_form = false;
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
		popupInit();
	};

	$scope.addNewCollection = function() {
		collection_bl.add($scope.new_collection_name);
		$scope.is_show_selection_collection = true;
		$scope.selected_collection = $scope.new_collection_name;
	};

	$scope.showAddCollectionForm = function() {
		$scope.is_show_selection_collection = false;
	};

	$scope.hideAddCollectionForm = function() {
		$scope.is_show_selection_collection = true;
	};
}]);

angular.module('Maps').controller('PointCollectionController',
	['$scope', '$rootScope', 'PointCollectionBussinessLayer',
function ($scope, $rootScope, PointCollectionBussinessLayer) {
	var point_collection_bl = PointCollectionBussinessLayer;

	$scope.pointCollectionBussinessLayer = point_collection_bl;

	$scope.$on('cleanCollection', function() {
		point_collection_bl.setActive(null);
	});
}]);

angular.module('Maps').controller('PointController',
['$scope', '$rootScope', 'PointBusinessLayer',
function ($scope, $rootScope, PointBusinessLayer) {
	var point_bl = PointBusinessLayer;

	$scope.active_points = {};

	$scope.$on('setCollectionActive', function (event, collection_name) {
		if (collection_name === null) {
			$scope.active_points = null;
		} else {
			$scope.active_points = point_bl.getPointsByCollection(collection_name);
		}
		$rootScope.$broadcast('displayMultiMarkers', $scope.active_points);
	});

	$scope.pointBusinessLayer = point_bl;

}]);

angular.module('Maps').controller('SearchResultController',
['$scope', '$rootScope',
function ($scope, $rootScope) {
	$rootScope.$on('searchSuccess', function(ev, data) {
		$scope.search_results = data;
		$scope.is_show_search_result_panel = true;
	});

	$scope.focusToPlace = function(pdata) {
		var boundingbox = pdata.boundingbox;
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
				'lat': parseFloat(pdata.lat),
				'lng': parseFloat(pdata.lon),
			},
			'bounds': {
				southWest: south_west,
				northEast: north_east,
			},
		});
		$rootScope.$broadcast('cleanCollection');
		$scope.is_show_search_result_panel = false;
	};

	$scope.closeSearchResultPanel = function() {
		$scope.is_show_search_result_panel = false;
	};


	$scope.is_show_search_result_panel = false;
}]);

angular.module('Maps').factory('CollectionBussinessLayer',
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

	cbl.add = function (new_collection_name) {
		collections[new_collection_name] = {};
	};

	return cbl;
}]);

angular.module('Maps').factory('PointBusinessLayer',
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

angular.module('Maps').factory('MapQuest',
['$http',
function ($http) {
	var mq_obj = {};

	mq_obj.search = function(address) {
		return $http({
			method: 'GET',
				url: 'https://open.mapquestapi.com/nominatim/v1/search',
				params: {
					'format': 'json',
					'q': address,
				}
		});
	};

	return mq_obj;
}]);

angular.module('Maps').factory('PointModel',
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
		// @TODO remove following when real backend db is there  21.07 2013 (houqp)
		if (!points[collection_name]) {
			points[collection_name] = {'points': {}};
		}

		points[collection_name].points[point_name] = point_data;
	};

	return pmodel;
}]);

angular.module('Maps').factory('Publisher',
['_Publisher', 'PointModel',
function (_Publisher, PointModel) {
	publisher = new _Publisher();

	publisher.subscribeObjectTo(PointModel, 'points');

	return publisher;
}]);

