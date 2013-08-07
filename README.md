# Maps development

You will need node.js version >= 0.8

To automatically pull all dependencies and build javascript files:

	make bootstrap


## Build JavaScript file

To build the JavaScript file run:

	make build

If you want to autocompile on change run:

	make watch

## Running unittests
Unittests are run with karma:

	make karma

afterwards the watch command can be run in a new terminal:

	make watch

This will automatically execute unittests when a coffeescript file has been changed and saved.

### PHPUnit
To run phpunittests once a file changed, simply run

    make phpunit

## Clear compiled folder
To clear the build/ folder run:

    make clean

## Run js unittests
To run js unittests with the ci server, use

	make test
