<div ng-controller="MarkerPanelController">
	<div id="main-marker-panel" class="map-hover"
     ng-show="is_show_main_marker_panel"
     oc-draggable>
		<a class="panel-close-button" ng-click="closeMainMarkerPanel()">
			<i class="icon-remove icon-large"></i>
		</a>
		<div id="main-marker-panel-body">
			<a ng-click="showAddMainMarkerForm()">
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
