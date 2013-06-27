
{{ script('vendor/angular/angular', 'appframework') }}
{{ script('public/app', 'appframework') }}
{{ script('public/app') }}

{{ script('vendor/leaflet/leaflet') }}
{{ script('vendor/angular-leaflet/angular-leaflet-directive.min') }}
{{ style('vendor/leaflet/leaflet') }}

{{ style('style') }}


<div id="app" ng-app="Map" ng-cloak>


<script type="text/ng-template" id="main.html">
	{% include 'partials/main.php' %}
</script>

	<div id="app-navigation">

		<ul class="with-icon">
			{% include 'nav.php' %}
		</ul>

		<div id="app-settings">
			{% include 'settings.php' %}
		</div>

	</div>

	<div id="app-content" ng-view></div>

</div>
