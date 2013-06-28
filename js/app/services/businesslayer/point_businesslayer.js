
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
