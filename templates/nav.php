<li>
	<div id="nav-control-group">
		<a ng-click="hideNavBar()">
			<i class="icon-circle-arrow-right icon-large"></i>
			<span class="icon-text">hide panel</span>
		</a>
	</div>
	<div>
		<a>
			<i class="icon-plus icon-large"></i>
			<span class="icon-text">add current marker to collection</span>
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



