
{{ script('vendor/angular/angular', 'appframework') }}
{{ script('public/app', 'appframework') }}
{{ script('public/app') }}

{{ script('vendor/leaflet/leaflet') }}
{{ script('vendor/angular-leaflet/angular-leaflet-directive.min') }}
{{ style('vendor/leaflet/leaflet') }}

{{ style('style') }}


<div id="app" ng-app="Map" ng-cloak>
	<script type="text/ng-template" id="main.html">
		{% include 'partials/main_view.php' %}
	</script>

	<div ng-controller="MainController">
		<div id="nav-toggle" class="map-hover">
			<div class="nav-toggle-icon"
			 ng-click="showSearchBar()" ng-show="!is_show_nav">
				<img class="control-icon"
				 src="{{ image_path('search.svg') }}"
				 alt="show search bar" />
			</div>

			<div class="nav-toggle-icon"
			 ng-click="showNavBar()" ng-show="!is_show_nav">
				<img class="control-icon"
				 src="{{ image_path('bookmarks.svg') }}"
				 alt="show bookmarks" />
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

		<div id="search-bar"></div>

		<div id="app-content" ng-view></div>

	</div>
</div>
