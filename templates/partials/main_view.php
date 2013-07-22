<div ng-controller="MarkerPanelController">
	<div id="main-marker-panel" class="map-hover"
     ng-show="is_show_main_marker_panel"
     oc-draggable>
		<a class="panel-close-button" ng-click="closeMainMarkerPanel()">
			<i class="icon-remove icon-large"></i>
		</a>
		<div id="main-marker-panel-body">
			<div ng-show="is_show_add_main_marker_form">
				<p>Current location: ([[ new_point_info.lat ]], [[ new_point_info.lng]])</p>
				<p>Location alias:</p>
				<input ng-model="new_point_name" type="text" placeholder="home"/>
				<p>Location description:</p>
				<input ng-model="new_point_info.message" type="text" placeholder="my current home"/>
				<!-- collection selection -->
				<p>Save to collection:</p>
				<div ng-show="is_show_selection_collection">
					<select ng-model="selected_collection"
					 ng-options="key as key for (key, value) in  collectionBussinessLayer.getAll()">
						<option value="">-- chose collection --</option>
					</select>
					<button ng-click="showAddCollectionForm()">
						<i class="icon-plus"></i>
					</button>
				</div>
				<div ng-show="!is_show_selection_collection">
					<input type="text" ng-model="new_collection_name"/>
					<button ng-click="addNewCollection()">
						<i class="icon-ok"></i>
					</button>
					<button ng-click="hideAddCollectionForm()">
						<i class="icon-remove"></i>
					</button>
				</div>

				<button ng-click="submitAddMainMarkerForm()">
					<p>Add</p>
				</button>
				<button ng-click="hideAddMainMarkerForm()">
					<p>Cancel</p>
				</button>
			</div>

			<a ng-show="!is_show_add_main_marker_form" ng-click="showAddMainMarkerForm()">
				<i class="icon-plus icon-large"></i>
				<span class="icon-text">add current marker to collection</span>
			</a>
		</div>
	</div>
</div>

<div ng-controller="MapController">
	<leaflet
		defaults="defaults"
		center="center"
		bounds="bounds"
		marker="main_marker"
		markers="markers">
	</leaflet>
</div>
