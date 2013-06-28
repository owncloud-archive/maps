<li>
	<a ng-click="hideNavBar()">hide nav bar</a>
</li>

<li class="open" ng-controller="PointController">
	<a ng-click="">Collections</a>
	<ul>
		<li ng-repeat="collection in pointBusinessLayer.getCollections()">
			<a>[[ collection.title ]]</a>
		</li>
	</ul>
</li>


