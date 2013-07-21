
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

	cbl.add = function (new_collection_name) {
		collections[new_collection_name] = {};
	};

	return cbl;
}]);
