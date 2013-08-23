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
