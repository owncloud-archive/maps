
I am a partial
<div ng-show="id">And I've got an id: [[ id ]]</div>

<div ng-controller="PointController">
	<div ng-repeat="collection in pointBusinessLayer.getCollections()">
		<p>[[ collection.title ]]</p>
	</div>
</div>

<div ng-controller="MapController">
	<style>
		.angular-leaflet-map {
			width: 640px;
			height: 480px;
		}
	</style>
	<leaflet center="center"></leaflet>
</div>
