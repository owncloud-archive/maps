<li>
	<div>
		<a ng-click="hideNavBar()">hide nav bar</a>
	</div>
</li>

<li class="open" ng-controller="PointController">
	<a ng-click="">Collections</a>
	<ul>
		<li ng-repeat="(title, data) in pointBusinessLayer.getCollections()">
			<a ng-click="showPointCollectionOnMap(title)">
				[[ title ]]
			</a>
		</li>
	</ul>
</li>


