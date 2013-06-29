
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


angular.module('Map').controller('MapController',
	['$scope',
function ($scope) {
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

	$scope.main_marker = {
		lat: 51.405,
		lng: -0.09,
		focus: true,
		draggable: true,
	};

	var setMainMarker = function () {
		$scope.markers.__main_marker = $scope.main_marker;
	};

	$scope.markers = {};
	setMainMarker();

	$scope.$on('displayMultiMarkers', function (event, markers) {
		$scope.markers = markers;
		// hrm, we have to always reset main marker because of the way
		// leaflet directive handles multi markers
		setMainMarker();
	});

}]);
