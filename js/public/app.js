(function(angular, $, undefined){

'use strict';

angular.module('Map', ['OC']).
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
	['$scope', '$routeParams', 'PointBusinessLayer',
function ($scope, $routeParams, PointBusinessLayer) {

	$scope.id = $routeParams.id;

}]);

angular.module('Map').controller('PointController',
	['$scope', 'PointBusinessLayer',
function ($scope, PointBusinessLayer) {

	var point_bl = PointBusinessLayer;

	$scope.pointBusinessLayer = point_bl;
	$scope.collections = point_bl.getCollection();

}]);

angular.module('Map').factory('PointBusinessLayer',
['PointModel',
function (PointModel) {
	var collections = [
		{
			'title': 'favorite',
		},
		{
			'title': 'friends\' home',
		},
	];
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