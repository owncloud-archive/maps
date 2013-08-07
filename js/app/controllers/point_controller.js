
/**
 * ownCloud - Maps app
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


angular.module('Maps').controller('PointController',
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
