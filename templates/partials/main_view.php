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
				<p>Save to collection:</p>
				<select ng-model="selected_collection"
				 ng-options="key as key for (key, value) in  collectionBussinessLayer.getAll()">
					<option value="">-- chose collection --</option>
				</select>
			</div>

			<button ng-show="is_show_add_main_marker_form" ng-click="submitAddMainMarkerForm()">
				<i class="icon-plus icon-large"></i>
				<span class="icon-text">Add</span>
			</button>
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
