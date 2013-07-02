app_name=map
build_directory=build/
package_name=$(build_directory)$(app_name)
grunt=$(CURDIR)/node_modules/grunt-cli/bin/grunt
phantomjs=$(CURDIR)/node_modules/phantomjs/bin/phantomjs


all: bootstrap

clean:
	rm -rf $(build_directory)


dist: clean
	mkdir -p $(build_directory)
	git archive HEAD --format=zip --prefix=$(app_name)/ > $(package_name).zip


# tests
test: javascript-tests unit-tests integration-tests acceptance-tests

phpunit: deps
	$(grunt) --config $(CURDIR)/Gruntfile.js testphp

unit-tests:
	phpunit tests/unit

integration-tests:
	phpunit tests/integration

acceptance-tests:
	cd tests/acceptance; make headless


javascript-tests:
	cd js; make test


watch: build
	$(grunt) --config $(CURDIR)/Gruntfile.js watchjs

karma: deps
	export CHROME_BIN=$(chrome_bin) && export FIREFOX_BIN=$(firefox_bin) && \
	$(grunt) --config $(CURDIR)/Gruntfile.js testjs

bootstrap: deps
	mkdir -p $(CURDIR)/js/public
	$(grunt) --config $(CURDIR)/Gruntfile.js bootstrap

build: deps
	$(grunt) --config $(CURDIR)/Gruntfile.js build

deps:
	npm install --deps


