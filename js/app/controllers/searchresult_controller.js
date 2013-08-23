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
