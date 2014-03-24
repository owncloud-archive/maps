
/**
 * ownCloud - Map app
 *
 * @author Qingping Hou
 *
 * @copyright 2013 Qingping Hou <qingping.hou@gmail.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU AFFERO GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this library.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

module.exports = function(grunt) {

	// load needed modules
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-wrap');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-phpunit');
	grunt.loadNpmTasks('grunt-bower-task');

	var path = require('path');

	grunt.initConfig({

		meta: {
			pkg: grunt.file.readJSON('package.json'),
			version: '<%= meta.pkg.version %>',
			production: 'js/public/'
		},

		bower: {
			install: {
				options: {
					targetDir: './',
					install: true,
					verbose: true,
					layout: function(type, component) {
						if (type == 'img' && component == 'leaflet-dist') {
							// put leaflet images with css files
							return 'js/vendor/leaflet-dist/images';
						} else if (type == 'fonts' && component == 'font-awesome') {
							return 'css/vendor/fonts';
						} else {
							var type_prefix = type + '/vendor';
							return path.join(type_prefix, component);
						}
					}
				}
			}
		},

		concat: {
			options: {
				// remove license headers
				stripBanners: true
			},
			dist: {
				src: [
					'js/config/app.js',
					'js/app/controllers/**/*.js',
					'js/app/directives/**/*.js',
					'js/app/filters/**/*.js',
					'js/app/services/**/*.js'
				],
				dest: '<%= meta.production %>app.js'
			}
		},

		wrap: {
			app: {
				src: ['<%= meta.production %>app.js'],
				dest: '',
				wrapper: [
					'(function(angular, $, undefined){\n\n\'use strict\';\n\n',
					'\n})(angular, jQuery);'
				]
			}
		},

		jshint: {
			files: [
				'Gruntfile.js',
				'bower.json',
				'js/app/controllers/**/*.js',
				'js/app/directives/**/*.js',
				'js/app/filters/**/*.js',
				'js/app/services/**/*.js',
				'js/app/tests/**/*.js',
				'js/config/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					console: true
				}
			}
		},

		watch: {
			// this watches for changes in the app directory and runs the concat
			// and wrap tasks if something changed
			concat: {
				files: [
					'js/app/controllers/**/*.js',
					'js/app/directives/**/*.js',
					'js/app/filters/**/*.js',
					'js/app/services/**/*.js',
					'js/config/*.js'
				],
				tasks: ['build']
			},
			phpunit: {
				files: './**/*.php',
				tasks: ['phpunit']
			}
		},

		phpunit: {
			classes: {
				dir: 'tests/unit'
			},
			options: {
				colors: true
			}
		},

		karma: {
			unit: {
				configFile: 'js/config/karma.js'
			},
			continuous: {
				configFile: 'js/config/karma.js',
				singleRun: true,
				browsers: ['PhantomJS'],
				reporters: ['progress', 'junit'],
				junitReporter: {
					outputFile: 'test-results.xml'
				}
			}
		}

	});

	// make tasks available under simpler commands
	grunt.registerTask('build', ['jshint', 'concat', 'wrap']);
	grunt.registerTask('bootstrap', ['bower', 'build']);
	grunt.registerTask('watchjs', ['watch:concat']);
	grunt.registerTask('ci', ['karma:continuous']);
	grunt.registerTask('testjs', ['karma:unit']);
	grunt.registerTask('testphp', ['watch:phpunit']);
	grunt.registerTask('default', ['bootstrap']);
	grunt.registerTask('installdep', ['bower']);

};
