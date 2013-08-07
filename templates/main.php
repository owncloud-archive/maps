{{ style('vendor/font-awesome/font-awesome.min') }}

{{ script('vendor/angular/angular', 'appframework') }}
{{ script('public/app', 'appframework') }}
{{ script('public/app') }}

{{ script('vendor/leaflet/leaflet') }}
{{ script('vendor/angular-leaflet/angular-leaflet-directive') }}
{{ style('vendor/leaflet/leaflet') }}

{{ style('style') }}


<div id="app" ng-app="Maps" ng-cloak>
	<script type="text/ng-template" id="main.html">
		{% include 'partials/main_view.php' %}
	</script>

	<div ng-controller="MainController">
		<div id="nav-toggle" class="map-hover">
			<div class="nav-toggle-icon"
			 ng-click="toggleSearchBar()" ng-show="!is_show_nav">
				<i class="icon-search icon-2x"></i>
			</div>

			<div class="nav-toggle-icon"
			 ng-click="showNavBar()" ng-show="!is_show_nav">
				<i class="icon-bookmark icon-2x"></i>
			</div>
		</div>

		<div id="app-navigation" class="map-hover" ng-show="is_show_nav">
			<ul class="with-icon">
				{% include 'nav.php' %}
			</ul>
			<div id="app-settings">
				{% include 'settings.php' %}
			</div>
		</div>

		<div id="search-bar" class="map-hover"
		 ng-show="is_show_search && !is_show_nav">
			<form>
				<input name="query" placeholder="Search a place"
					ng-model="search_keyword" autocomplete="off" type="search">
				<button ng-click="searchByAddress()"> Search </button>
			</form>
		</div>

		<div id="app-content" ng-view></div>

	</div>
</div>
