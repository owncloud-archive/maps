/**
 * ownCloud - Map app
 *
 * @author Qingping Hou
 *
 * @copyright 2013 Qingping Hou <qingping.hou@gmail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


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
