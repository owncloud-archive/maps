
I am a partial
<div ng-show="id">And I've got an id: [[ id ]]</div>

<div ng-controller="PointController">
	<div ng-repeat="collection in pointBusinessLayer.getCollections()">
		<p>[[ collection.title ]]</p>
	</div>
</div>

