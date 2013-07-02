<li>
	<div id="panel-hide-button">
		<a ng-click="hideNavBar()">
			&gt;&gt; Hide Panel
		</a>
	</div>
</li>

<li class="open" ng-controller="CollectionController">
	<a ng-click="">Collections</a>
	<ul>
		<li ng-repeat="(key, val) in collectionBussinessLayer.getAll()"
			ng-class="{
				active: collectionBussinessLayer.isActive(key)
			}">
			<a ng-click="collectionBussinessLayer.setActive(key)">
				[[ key ]]
			</a>
		</li>
	</ul>
</li>


<li class="open" ng-controller="PointController">
	<a ng-click="">Current points</a>
	<ul>
		<li ng-repeat="(key, val) in active_points">
			<a>[[ key ]]</a>
		</li>
	</ul>
</li>



